// import HeaderButton from '@app/app/components/HeaderButton';
// import { colors } from '@app/app/styles';
// import AppStyles from '@app/app/styles/AppStyles';
// import React from 'react';
// import { SafeAreaView, ScrollView } from 'react-native';
// import NavigationOptions from '../../../components/NavigationOptions';
// import MyQueueListItem from './MyQueueListItem';
// import screens from '../../../constants/screens';
// const MyQueue = () => {
//   return (
//     <SafeAreaView style={[AppStyles.root]}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <MyQueueListItem />
//         <MyQueueListItem />
//         <MyQueueListItem />
//         <MyQueueListItem />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
// MyQueue.navigationOptions = ({ navigation }) => {
//   return NavigationOptions({
//     title: '',
//     isBack: false,
//     navigation: navigation,
//     headerLeft: (
//       <HeaderButton
//         type={1}
//         iconName={'md-menu'}
//         color={colors.primary}
//         isFeather={false}
//         iconType={'ionic'}
//         onPress={() => navigation.openDrawer()}
//       />
//     ),
//     headerRight: (
//       <HeaderButton
//         type={1}
//         iconName={'add-circle'}
//         color={colors.primary}
//         isFeather={false}
//         iconType={'ionic'}
//         onPress={() => navigation.navigate(screens.Step1)}
//       />
//     ),
//     headerStyle: { elevation: 0 }
//   });
// };
// export default MyQueue;

import HeaderButton from '@app/app/components/HeaderButton';
import { colors } from '@app/app/styles';
import AppStyles from '@app/app/styles/AppStyles';
import React, { useState, useEffect } from 'react';
import {  FlatList, ActivityIndicator, Alert, Text, StyleSheet } from 'react-native';
import NavigationOptions from '../../../components/NavigationOptions';
import MyQueueListItem from './MyQueueListItem';
import { getCategories, getQueueList } from '@app/app/services/apiService'; // Adjust import path
import screens from '../../../constants/screens';
import { verticalScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyQueue = ({ navigation, route }) => {
    const params = navigation.state?.params || {};
  const [queues, setQueues] = useState(params.queues || []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [ categories, setCategories ] = useState();
  
    useEffect( () => {
      const fetchCategories = async () => {
        try {
          const res = await getCategories();
          const list = res?.data?.map( ( c ) => ( {
            text: c.name,
            value: c.id,
          } ) );
          setCategories( list );
        } catch ( err ) {
          console.error( "Error fetching categories:", err );
          setCategories( [] );
        }
      };
      fetchCategories();
    }, [] );

  const fetchQueueList = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getQueueList();
      setQueues(response.data || []); // Set the array of queues from the response
    } catch (e) {
      console.error('Queue list fetch error:', e.message);
      setError(e.message || 'Unable to fetch queue list');
      Alert.alert('Error', e.message || 'Unable to fetch queue list');
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (params.queues) {
    setQueues(params.queues);
  }
      fetchQueueList();
}, [params.queues]);



  const renderQueueItem = ({ item }) => {
    console.log(item,"item");
    
  // Find category name from categories list
  const categoryName =
    categories?.find((c) => c.value.toString() === item.category.toString())?.text || 'Unknown Category';

  return (
    <MyQueueListItem
      name={item.name || 'Unnamed Queue'}
      category={categoryName} // show category name instead of id
      date={
        item.start_date
          ? new Date(item.start_date).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          : 'No Date'
      }
      desks={item.noOfDesk || 0}
      people={(item.end_number - item.start_number + 1) || 0}
    />
  );
};


  if (loading) {
    return (
      <SafeAreaView style={[AppStyles.root]}>
        <ActivityIndicator size="large" color={colors.primary} style={AppStyles.loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[AppStyles.root]}>
      <FlatList
        data={queues}
        renderItem={renderQueueItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // Use a unique ID if available
        ListEmptyComponent={
          error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.noDataText}>No queues available</Text>
          )
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

MyQueue.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: false,
    navigation: navigation,
    headerLeft: (
      <HeaderButton
        type={1}
        iconName={'md-menu'}
        color={colors.primary}
        isFeather={false}
        iconType={'ionic'}
        onPress={() => navigation.openDrawer()}
      />
    ),
    headerRight: (
      <HeaderButton
        type={1}
        iconName={'add-circle'}
        color={colors.primary}
        isFeather={false}
        iconType={'ionic'}
        onPress={() => navigation.navigate(screens.Step1)}
      />
    ),
    headerStyle: { elevation: 0 },
  });
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: verticalScale(10),
  },
  errorText: {
    color: colors.red,
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
  noDataText: {
    color: colors.lightWhite,
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
});

export default MyQueue;