import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Modal, Alert, Platform } from 'react-native';
import { Touchable } from '@app/app/components/Button';
import { connect } from 'react-redux';
import SafeAreaView from 'react-native-safe-area-view';
import TextView from '../../components/TextView/TextView';
import AppStyles from '../../styles/AppStyles';
import NavigationOptions from '../../components/NavigationOptions';
import HeaderButton from '../../components/HeaderButton';
import { colors } from '../../styles';
import screens from '../../constants/screens';
import ScrollableAvoidKeyboard from '@app/app/components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import Input from '@app/app/components/Input';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import { borderRadius } from '@app/app/styles/dimensions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { checkToken, generateToken, getCategories } from '@app/app/services/apiService';
import { Button } from '@app/app/components/Button';
import Card from '@app/app/components/Card';
import Toast from 'react-native-toast-message';
import { Link } from '@react-navigation/native';
import { color } from 'react-native-reanimated';

function Home( props ) {
  const [ isScanning, setIsScanning ] = useState( false );
  const [ qrDetails, setQrDetails ] = useState( null );
  const [ tokenDetails, setTokenDetails ] = useState( null );
  const [ categories, setCategories ] = useState( [] );
  const [ isLoading, setIsLoading ] = useState( false );
  const [ isLoadingCategories, setIsLoadingCategories ] = useState( false );
  const [ activeTab, setActiveTab ] = useState( null );
  const [ joinCode, setJoinCode ] = useState( '' );
  const [ link, setLink ] = useState( '' );
  const [ location, setLocation ] = useState( '' ); // "lat,lng"
  const [ joinMethod, setJoinMethod ] = useState( null );
  const tabs = [
    { key: 'private', label: 'Invite code' },
    { key: 'link', label: 'Link' },
    { key: 'location', label: 'Location' },
    { key: 'qr', label: 'QR Code' },
  ];

  useEffect( () => {
    console.log( 'Home' );
    props.navigation.setParams( { openDrawer: _openDrawer } );

    const fetchCategories = async () => {
      setIsLoadingCategories( true );
      try {
        const res = await getCategories();
        const list = res?.data?.map( ( c ) => ( {
          text: c.name,
          value: c.id,
        } ) );
        setCategories( list );
      } catch ( err ) {
        console.error( "Error fetching categories:", err );
        Alert.alert( 'Error', 'Failed to load categories.' );
        setCategories( [] );
      } finally {
        setIsLoadingCategories( false );
      }
    };
    fetchCategories();
  }, [] );

  const _openDrawer = () => {
    props.navigation.openDrawer();
    setQrDetails( null );
  };

  const onPressHome = () => {
    props.navigation.navigate( screens.Categories );
  };
  const showToast = ( type, title, message ) => {
    Toast.show( {
      type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 60,
    } );
  };
  const checkCameraPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
      const result = await check( permission );
      if ( result === RESULTS.GRANTED ) return true;
      const requestResult = await request( permission );
      if ( requestResult !== RESULTS.GRANTED ) {
        showToast( 'error', 'Permission Denied', 'Camera access is required to scan QR codes.' );
      }
      return requestResult === RESULTS.GRANTED;
    } catch ( err ) {
      console.error( 'Permission check error:', err );
      showToast( 'error', 'Error', 'Failed to check camera permission.' );
      return false;
    }
  };
  const clearInputs = () => {
    setJoinCode( '' );
    setLink( '' );
    setLocation( '' );
    setQrDetails( null );
    setTokenDetails( null );
  };
  const onPressScan = async () => {
    setIsLoading( true );
    const hasPermission = await checkCameraPermission();
    setIsLoading( false );
    if ( hasPermission ) {
      setIsScanning( true );
    }
  };

  const onScanSuccess = async ( e ) => {
    try {
      let qrData;
      if ( activeTab === "qr" ) {
        if ( !e.data || e.data === 'undefined' ) {
          throw new Error( 'Invalid QR code data: received undefined' );
        }
        console.log( qrData );

        try {
          qrData = JSON.parse( e.data );
          if ( !qrData.queueId || !qrData.category ) {
            throw new Error( 'Queue ID or Category is missing in QR code data' );
          }
        } catch {
          throw new Error( 'QR code data is not valid JSON' );
        }

        setIsScanning( false );
      }


      let payload = { joinMethods: joinMethod }; // always include joinMethod

      switch ( joinMethod ) {
        case 'private':
          payload.joinCode = joinCode;
          break;

        case 'link':
          payload.link = link;
          break;

        case 'location':
          const [ latStr, longStr ] = location.split( ',' );
          const lat = parseFloat( latStr?.trim() );
          const long = parseFloat( longStr?.trim() );
          if ( isNaN( lat ) || isNaN( long ) ) {
            throw new Error( 'Enter valid lat,long (e.g., 23.12,72.57)' );
          }
          payload.lat = lat;
          payload.long = long;
          break;

        case 'qr':
          payload.queueId = qrData.queueId;
          payload.categoryId = qrData.category;
          break;

        default:
          throw new Error( 'Invalid joinMethod provided' );
      }
      console.log( payload, "payload" );

      const tokenCheckResponse = await checkToken( payload );
      console.log( tokenCheckResponse, "token" );

      if ( tokenCheckResponse.status === 200 && tokenCheckResponse.data?.data && tokenCheckResponse.data.status === "ok" ) {
        setTokenDetails( tokenCheckResponse.data.data );
        showToast(
          'info',
          'Token Already Generated',
          `You already have a token, your token number is ${ tokenCheckResponse.data.data.tokenNumber }`
        );
        clearInputs();
        setActiveTab();
        setQrDetails( null );
      } else {
        setQrDetails( tokenCheckResponse.data.data );
        showToast( 'info', 'No Token', 'Please press "Generate Token" to create a new token.' );
      }
    } catch ( error ) {
      console.error( 'Error processing QR code:', error.message, error.response?.data );
      showToast( 'error', 'Scan Failed', error.message || 'Could not process QR code' );
      setIsScanning( false );
    }
  };

  const onPressGenerateToken = async () => {
    try {
      if ( !qrDetails ) {
        Alert.alert( 'Error', 'No QR code data available. Please scan a QR code first.' );
        return;
      }
      const tokenResponse = await generateToken( {
        queueId: qrDetails.queueId,
        categoryId: qrDetails.category,
      } );
      if ( tokenResponse.status === 'ok' && tokenResponse.data ) {
        setTokenDetails( tokenResponse.data );
        showToast(
          'success',
          'Token Generated!',
          `Token generated successfully: ${ tokenResponse.data.tokenNumber }`
        );
        setQrDetails( null );
        clearInputs();
        setActiveTab();
      } else {
        throw new Error( tokenResponse.message || 'Failed to generate token' );
      }
    } catch ( error ) {
      showToast( 'error', 'Failed', error.message || 'Could not generate token' );
      Alert.alert( 'Error', error.message || 'Failed to generate token' );
    }
  };

  const getCategoryName = ( categoryId ) => {
    if ( !categories || categoryId === null || categoryId === undefined ) {
      return 'Unknown Category';
    }
    const category = categories.find( ( cat ) => cat.value === Number( categoryId ) );
    return category ? category.text : 'Unknown Category';
  };

  const handleTabPress = async ( tab ) => {
    console.log( tab, "tab" );

    setActiveTab( tab );
    setJoinMethod( tab );
    if ( tab === 'qr' ) {
      const hasPerm = await checkCameraPermission();
      if ( hasPerm ) setIsScanning( true );
    }
  };

  return (
    <>
      <SafeAreaView style={ [ AppStyles.root ] }>
        <ScrollableAvoidKeyboard showsVerticalScrollIndicator={ false } keyboardShouldPersistTaps={ 'handled' }>
          <Input placeholder='Search Shop Here' isIconLeft={ true } leftIconName={ 'search' } color={ colors.white } />
          <View style={ s.tabContainer }>
            { tabs.map( tab => (
              <Touchable
                key={ tab.key }
                onPress={ () => handleTabPress( tab.key ) }
                style={ [ s.tab, activeTab === tab.key && s.activeTab ] }
              >
                <TextView
                  text={ tab.label }
                  color={ activeTab === tab.key ? colors.white : colors.lightWhite }
                  type="body-one"
                />
              </Touchable>
            ) ) }
          </View>

          {/* === TAB CONTENT === */ }
          { activeTab === 'private' && (
            <Input
              placeholder="Enter 6-digit code"
              value={ joinCode }
              onChangeText={ setJoinCode }
              keyboardType="numeric"
              maxLength={ 6 }
              style={ s.input }
            />
          ) }

          { activeTab === 'location' && (
            <Input
              placeholder='Enter lat,long (e.g., 23.12,72.57)'
              value={ location }
              onChangeText={ setLocation }
              text={ `Lat:, Lng:` }
              color={ colors.lightWhite }
              style={ s.input }
            />
          ) }

          { activeTab === 'link' && (
            <Input
              text="link"
              placeholder="Enter link https://.."
              value={ link }
              onChangeText={ setLink }  // Added
              color={ colors.lightWhite }
              style={ s.input }
            />
          ) }

          { activeTab === 'qr' && (
            <TextView
              color={ colors.lightWhite }
              style={ s.input }
              onPress={ onPressScan }
            />
          ) }

          { activeTab &&
            <Button
              ButtonText="Check & Join"
              onPress={ onScanSuccess }
              disabled={ isLoading }
              style={ [ s.SendBut ] }
            /> }
          { qrDetails && (
            <Card>
              <View style={ [ s.qrDetails ] }>
                <TextView
                  color={ colors.white }
                  text={ `Queue Name: ${ qrDetails.queueName || 'N/A' }` }
                  type="body"
                  style={ s.profileText }
                />
                <TextView
                  color={ colors.white }
                  text={ `Category: ${ isLoadingCategories ? 'Loading...' : getCategoryName( qrDetails.category ) }` }
                  type="body"
                  style={ s.profileText }
                />
                <TextView
                  color={ colors.white }
                  text={ `Token Range: ${ qrDetails.tokenRange }` }
                  type={ 'body' }
                  style={ s.profileText }
                />
                { tokenDetails && (
                  <TextView
                    color={ colors.white }
                    text={ `Your Token: ${ tokenDetails.tokenNumber }` }
                    type="body"
                    style={ s.profileText }
                  />
                ) }
                <View style={ s.buttonContainer }>
                  <Button
                    onPress={ onPressGenerateToken }
                    ButtonText="Generate Token"
                    style={ [ s.btn, s.generateBtn ] }
                    disabled={ isLoading || !!tokenDetails }
                  />
                  <Button
                    onPress={ () => {
                      setQrDetails( null );
                      setTokenDetails( null );
                    } }
                    ButtonText="Cancel"
                    style={ [ s.btn, s.cancelBtn ] }
                    disabled={ isLoading }
                  />
                </View>
              </View>
            </Card>
          ) }
          <Image style={ s.mainImg } source={ require( '../../assets/images/home.png' ) } />
          <TextView text={ 'Categories' } type={ 'button-text' } color={ colors.lightWhite } style={ s.Text } />
          <View style={ s.Categories }>
            <Touchable style={ s.CategoriesOption }>
              <TextView text={ 'Hospitals' } type={ 'body-one' } color={ colors.lightWhite } />
            </Touchable>
            <Touchable style={ s.CategoriesOption }>
              <TextView text={ 'Beverages' } type={ 'body-one' } color={ colors.lightWhite } />
            </Touchable>
            <Touchable style={ s.CategoriesOption }>
              <TextView text={ 'Banquets' } type={ 'body-one' } color={ colors.lightWhite } />
            </Touchable>
            <Touchable style={ s.CategoriesOption } onPress={ onPressHome }>
              <TextView text={ 'View More' } type={ 'body-one' } color={ colors.lightWhite } />
            </Touchable>
          </View>

        </ScrollableAvoidKeyboard>
      </SafeAreaView>
      <Modal visible={ isScanning } animationType="slide" onRequestClose={ () => setIsScanning( false ) }>
        <SafeAreaView style={ AppStyles.root }>
          <QRCodeScanner
            onRead={ onScanSuccess }
            reactivate={ true }
            showMarker={ true }
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const s = StyleSheet.create( {
  mainImg: {
    marginTop: verticalScale( 15 ),
    alignSelf: 'center',
  },
  Text: {
    marginTop: verticalScale( 20 ),
    marginLeft: 12,
  },
  Categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  CategoriesOption: {
    width: '45%',
    padding: moderateScale( 20 ),
    marginTop: verticalScale( 10 ),
    marginHorizontal: scale( 5 ),
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: borderRadius,
  },
  qrDetails: {
    paddingVertical: scale( 15 ),
    // margin:"cem"
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: scale( 15 ),
    width: '100%',
  },
  profileText: {
    marginTop: verticalScale( 5 ),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale( 15 ),
    paddingHorizontal: scale( 10 ),
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius,
    paddingVertical: verticalScale( 10 ),
    paddingHorizontal: scale( 10 ),
  },
  generateBtn: {
    flex: 1,
    marginRight: scale( 5 ),
    backgroundColor: colors.primary,
  },
  cancelBtn: {
    flex: 1, // Take equal space
    marginLeft: scale( 5 ), // Small gap between buttons
    backgroundColor: colors.grey || '#808080', // Different color for Cancel
  },
  buttonText: {
    fontSize: scale( 14 ), // Text size for buttons
    color: colors.white, // Text color
    textAlign: 'center', // Center text
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale( 10 ),
    backgroundColor: colors.inputBackgroundColor,
  },
  qrDetails: { padding: scale( 15 ) },
  token: { fontWeight: 'bold', marginTop: 10 },
  tabContainer: {
    flexDirection: 'row',
    borderColor: colors.grey,
    marginTop: 10,
    backgroundColor: colors.inputBackgroundColor,
  },
  tab: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',

  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  input: {
    marginHorizontal: 5,
    marginVertical: 5
  },
  SendBut: {
    backgroundColor: colors.primary,
    // width: 'auto',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  }
} );

Home.navigationOptions = ( { navigation } ) => {
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
        onPress={ navigation.getParam( 'openDrawer' ) }
      />
    ),
    headerStyle: { elevation: 0 },
  } );
};

const mapStateToProps = ( state ) => ( { auth: state.auth } );

export default connect( mapStateToProps, {} )( Home );