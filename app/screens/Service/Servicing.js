import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyles from '@app/app/styles/AppStyles';
import ScrollableAvoidKeyboard from '@app/app/components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import { getCategories, getQueueDetails, getServicingList, getServicingSkip, recoverSkippedToken } from '@app/app/services/apiService';
import NavigationOptions from '@app/app/components/NavigationOptions';
import HeaderButton from '@app/app/components/HeaderButton';
import CheckBox from 'react-native-check-box';
import { colors } from '@app/app/styles';

const Servicing = ( { navigation } ) => {
  const queueId = navigation.getParam( 'queueId' );
  const categoryid = navigation.getParam( 'categoryid' );
  const SERVICE_TIME = 10;
  const [ nowServing, setNowServing ] = useState( 0 );
  const [ lastIssued, setLastIssued ] = useState( 0 );
  const [ customers, setCustomers ] = useState( [] );
  const [ selected, setSelected ] = useState( [] );
  const [ lastRecords, setLastRecords ] = useState( [] );
  const [ categories, setCategories ] = useState( [] );
  const [ loading, setLoading ] = useState( true );

  const calculateEstimatedTimes = ( allCustomers, currentServing ) => {
    const sorted = [ ...allCustomers ].sort( ( a, b ) => a.tokenNumber - b.tokenNumber );
    const pending = sorted.filter( ( c ) => c.tokenNumber >= currentServing );
    return pending.map( ( c, index ) => ( {
      ...c,
      estimatedWait: index * SERVICE_TIME,
    } ) );
  };

  useEffect( () => {
    if ( queueId && categoryid ) {
      fetchQueueData( queueId, categoryid );
    } else {
      console.error( 'Queue or category missing in params', { queueId, categoryid } );
      Alert.alert( 'Error', 'Missing queue or category information.' );
      setLoading( false );
    }
  }, [ queueId, categoryid ] );

  const handledcategorylist = async () => {
    try {
      const res = await getCategories();
      console.log( res, "categories" );

      const list = res?.data?.map( ( c ) => ( {
        key: c.id,
        value: c.name,
      } ) );
      setCategories( list );
      return list;
    } catch ( err ) {
      console.error( 'Error fetching categories:', err );
      setCategories( [] );
      return [];
    }
  };

  const fetchQueueData = async ( queueId, categoryId ) => {
    setLoading( true );
    try {
      const categoryList = await handledcategorylist();
      const categoryMap = new Map( categoryList.map( ( cat ) => [ cat.key, cat.value ] ) );

      const [ servicingData, queueDetails ] = await Promise.all( [
        getServicingList( queueId, categoryId ),
        getQueueDetails( queueId ),
      ] );

      if ( servicingData.status === 'ok' && servicingData.data ) {
        const mappedCustomers = servicingData.data.map( ( token ) => {
          const category =
            token.categoryid != null
              ? categoryMap.get( token.categoryid ) ||
              token.queue.name ||
              'Unknown Category'
              : token.queue.name || 'No Category ID Provided';

          return {
            id: token.id,
            name: `${ token.customer.FirstName } ${ token.customer.LastName }`.trim() || 'Unknown Customer',
            service: token.queue.name || 'Unknown Service',
            tokenNumber: token.tokenNumber,
            queueId: token.queueId,
            category: category,
            isSkipped: token.isSkipped || false,
            isActive: false,
          };
        } );

        const activeCustomers = mappedCustomers.filter( ( c ) => !c.isSkipped );

        if ( activeCustomers.length === 0 ) {
          setCustomers( [] );
          setLastIssued( 0 );
          setNowServing( 0 );
          Alert.alert( 'Info', 'No active customers in queue.' );
          return;
        }

        const firstToken = Math.min( ...activeCustomers.map( ( c ) => c.tokenNumber ) );
        const lastToken = Math.max( ...activeCustomers.map( ( c ) => c.tokenNumber ) );

        const updatedCustomers = activeCustomers.map( ( c ) => ( {
          ...c,
          isActive: c.tokenNumber === firstToken,
        } ) );

        const customersWithTime = calculateEstimatedTimes( updatedCustomers, firstToken );

        setCustomers( customersWithTime );
        setNowServing( firstToken );
        setLastIssued( lastToken );

      } else {
        setCustomers( [] );
        setLastIssued( 0 );
        setNowServing( 0 );
        Alert.alert( 'Info', servicingData.message || 'No tokens found for servicing' );
      }
    } catch ( error ) {
      console.error( 'Fetch queue data error:', error );
      Alert.alert( 'Error', error.message || 'Failed to load queue data. Please try again.' );
    } finally {
      setLoading( false );
    }
  };


  const callNext = () => {
    if ( customers.length === 0 ) {
      Alert.alert( 'Info', 'No more customers in queue.' );
      return;
    }
    const temp = [ ...customers ];
    if ( customers.length > 3 ) {
      temp.shift();
      setCustomers( temp );
    }


    const sorted = temp.sort( ( a, b ) => a.tokenNumber - b.tokenNumber );
    const currentIndex = sorted.findIndex( ( c ) => c.tokenNumber === nowServing );
    const next = sorted[ currentIndex + 1 ];

    if ( !next ) {
      Alert.alert( 'Info', 'No more customers to serve.' );
      return;
    }
    setNowServing( next.tokenNumber );
    const updated = sorted.map( ( c ) => ( {
      ...c,
      isActive: c.tokenNumber === next.tokenNumber,
    } ) );

    setCustomers( updated );
  };

  const skip = async () => {
    if ( selected.length === 0 ) {
      Alert.alert( 'Warning', 'Please select at least one customer to skip.' );
      return;
    }
    try {
      const data = await getServicingSkip( selected );
      if ( data.status !== 'ok' ) {
        throw new Error( data.message || 'Failed to skip tokens' );
      }

      const tokens = Array.isArray( data.data ) ? data.data : [ data.data ];
      const updatedRecords = [];
      for ( const token of tokens ) {
        const customer = customers.find( ( c ) => c.id === token.id );
        updatedRecords.push( {
          token: token.tokenNumber,
          status: 'Skipped',
          name: customer?.name || 'Unknown',
        } );
      }

      setLastRecords( [ ...lastRecords, ...updatedRecords ].slice( -3 ) );
      setSelected( [] );

      // Refresh full list (skipped tokens stay visible via backend)
      fetchQueueData( queueId, categoryid );
    } catch ( error ) {
      console.error( 'Skip error:', error.message );
      Alert.alert( 'Error', error.message || 'Failed to skip selected tokens' );
    }
  };
const recoverToken = async (record) => {
  try {
    // API call to recover the skipped token
    const response = await recoverSkippedToken(record.token);

    if (response.status !== 'ok') {
      throw new Error(response.message || 'Failed to recover token');
    }

    // Remove from lastRecords
    setLastRecords(prev => prev.filter(r => r.token !== record.token));

    // Refresh queue data to show recovered token in queue
    fetchQueueData(queueId, categoryid);

    Alert.alert('Success', `Token ${record.token} recovered successfully.`);
  } catch (error) {
    console.error('Recover error:', error);
    Alert.alert('Error', error.message || 'Failed to recover token');
  }
};
  useEffect( () => {
    if ( customers.length > 0 && nowServing > 0 ) {
      setCustomers( ( prev ) =>
        prev.map( ( c ) => ( {
          ...c,
          isActive: !c.isSkipped && c.tokenNumber === nowServing,
        } ) )
      );
    }
  }, [ nowServing ] );


  const toggleSelect = ( id ) => {
    if ( selected.includes( id ) ) {
      setSelected( selected.filter( ( s ) => s !== id ) );
    } else {
      setSelected( [ ...selected, id ] );
    }
  };

  const renderCustomer = ( { item } ) => {
    const isSelected = selected.includes( item.id );
    return (
      <TouchableOpacity onPress={ () => toggleSelect( item.id ) } style={ styles.customerItem }>
        <CheckBox
          isChecked={ isSelected }
          onClick={ () => toggleSelect( item.id ) }
          checkBoxColor={ isSelected ? colors.primary : colors.gray }
        />
        <View style={ styles.customerDetails }>
          <Text style={ styles.customerName }>{ item.name }</Text>
          <Text style={ styles.customerService }>{ item.service }</Text>
          <Text style={ styles.waitTime }>
            Token: { item.tokenNumber } | Wait Time: { item.estimatedWait } min
          </Text>
          { item.isSkipped && (
            <Text style={ styles.skippedBadge }>Skipped - Waiting for Arrival</Text>
          ) }
          { item.isActive && (
            <View style={ styles.activeBadge }>
              <Text style={ styles.activeText }>Arrived</Text>
            </View>
          ) }
        </View>
      </TouchableOpacity>
    );
  };

const renderLastRecord = ({ item }) => (
  <View style={styles.lastRecord}>
    <Text style={{ color: '#fff', flex: 1 }}>
      Token {item.token} - {item.status} ({item.name})
    </Text>
    {item.status === 'Skipped' && (
      <TouchableOpacity
        onPress={() => recoverToken(item)}
        style={styles.recoverButton}
      >
        <Text style={styles.recoverText}>Recover</Text>
      </TouchableOpacity>
    )}
  </View>
);

  if ( loading ) {
    return (
      <SafeAreaView style={ [ AppStyles.root ] }>
        <ActivityIndicator size="large" color={ colors.primary } style={ AppStyles.loading } />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={ [ AppStyles.root ] }>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={ false } keyboardShouldPersistTaps={ 'handled' }>
        {/* Header remains same */ }
        <View style={ styles.header }>
          <View style={ styles.servingContainer }>
            <View style={ styles.servingcount }>
              <Text style={ styles.label }>Now Serving</Text>
              <Text style={ styles.number }>{ nowServing }</Text>
            </View>
          </View>
          <View style={ styles.issuedContainer }>
            <Text style={ styles.label }>Last Issued</Text>
            <Text style={ styles.number }>{ lastIssued }</Text>
          </View>
        </View>
        <Text style={ styles.customersTitle }>Customers in Queue</Text>
        <FlatList
          data={ customers.slice( 0, 3 ) }
          renderItem={ renderCustomer }
          keyExtractor={ ( item ) => item.id.toString() }
          style={ styles.list }
          ListEmptyComponent={ <Text style={ styles.noCustomers }>No customers to serve</Text> }
        />
        {/* Last Records remains same */ }
        { lastRecords.length > 0 && (
          <View style={ styles.lastRecords }>
            <Text style={ styles.recordsTitle }>Last 3 Records</Text>
            <FlatList
              data={ lastRecords }
              renderItem={ renderLastRecord }
              keyExtractor={ ( item, index ) => index.toString() }
              style={ styles.recordList }
            />
          </View>
        ) }

        <View style={ styles.queuingControls }>
          <TouchableOpacity style={ styles.buttonGreen } onPress={ callNext }>
            <Text style={ styles.buttonText }>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ styles.buttonRed } onPress={ skip }>
            <Text style={ styles.buttonText }>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ styles.buttonRed } onPress={ () => navigation.goBack() }>
            <Text style={ styles.buttonText }>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollableAvoidKeyboard>
    </SafeAreaView>
  );
};

Servicing.navigationOptions = ( { navigation } ) => {
  return NavigationOptions( {
    title: '',
    isBack: false,
    navigation: navigation,
    headerLeft: (
      <HeaderButton
        type={ 1 }
        iconName={ 'md-menu' }
        color={ colors.primary }
        isFeather={ false }
        iconType={ 'ionic' }
        onPress={ () => navigation.openDrawer() }
      />
    ),
    headerStyle: { elevation: 0 },
  } );
};

const styles = StyleSheet.create( {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  servingContainer: {
    alignItems: 'center',
  },
  issuedContainer: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    color: colors.gray,
  },
  servingcount: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
  },
  number: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  customersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    color: colors.primary,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  customerDetails: {
    flex: 1,
    marginLeft: 10,
  },
  customerName: {
    fontSize: 16,
    color: '#fff',
  },
  customerService: {
    fontSize: 14,
    color: '#fff',
  },
  waitTime: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 5,
  },
  list: {
    paddingHorizontal: 20,
  },
  noCustomers: {
    color: '#fff',
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  queuingControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  buttonRed: {
    backgroundColor: '#FF6A00',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastRecords: {
    padding: 10,
  },
  recordsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  recordList: {
    marginTop: 5,
  },
 lastRecord: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
  },
  recoverButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  recoverText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    padding: 20,
    fontSize: 18,
  },
  skippedBadge: {
    fontSize: 12,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: 'green',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  activeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonGreen: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
} );

export default Servicing;