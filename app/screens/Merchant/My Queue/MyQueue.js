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
import { FlatList, ActivityIndicator, Alert, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import NavigationOptions from '../../../components/NavigationOptions';
import MyQueueListItem from './MyQueueListItem';
import { getCategories, getQueueList } from '@app/app/services/apiService';
import screens from '../../../constants/screens';
import { verticalScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyQueue = ({ navigation, route }) => {
  const params = navigation.state?.params || {};
  const [queues, setQueues] = useState(params.queues || []);
  const [filteredQueues, setFilteredQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return 'running';
      case 2:
        return 'cancel';
      default:
        return 'unknown';
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const list = res?.data?.map((c) => ({ text: c.name, value: c.id }));
      setCategories(list);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  const fetchQueueList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getQueueList();
      let queueData = response.data || [];
      queueData.sort((a, b) => new Date(b.start_date || b.created_at || 0) - new Date(a.start_date || a.created_at || 0));
      if (params.queues?.length > 0) {
        const uniqueNewQueues = params.queues.filter((q) => !queueData.some((existing) => existing.id === q.id));
        queueData = [...uniqueNewQueues, ...queueData];
      }

      // Aggregate people count by category
      const categoryCount = {};
      queueData.forEach((queue) => {
        const category = queue.category;
        categoryCount[category] = (categoryCount[category] || 0) + 1; // Count number of queues per category
      });

      // Update queues with aggregated people count
      const updatedQueues = queueData.map((queue) => ({
        ...queue,
        people: categoryCount[queue.category] || 0,
      }));

      setQueues(updatedQueues);
      filterQueues(activeTab);
    } catch (e) {
      console.error('Queue list fetch error:', e.message);
      setError(e.message || 'Unable to fetch queue list');
    } finally {
      setLoading(false);
    }
  };

  const filterQueues = (tab) => {
    let updatedQueues = [...queues];
    if (tab === 'all') {
      setFilteredQueues(updatedQueues);
    } else {
      const tabStatus = tab === 'running' ? 1 : tab === 'cancel' ? 2 : null;
      if (tabStatus !== null) {
        setFilteredQueues(updatedQueues.filter((queue) => queue.status === tabStatus));
      } else {
        setFilteredQueues(updatedQueues);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchQueueList();
  }, [params.queues]);

  useEffect(() => {
    filterQueues(activeTab);
  }, [activeTab, queues]);

  const renderQueueItem = ({ item }) => {
    const categoryName =
      categories?.find((c) => c.value.toString() === item.category.toString())?.text || 'Unknown Category';
    const statusLabel = getStatusLabel(item.status);

    return (
      <MyQueueListItem
        name={item.name || 'Unnamed Queue'}
        category={categoryName}
        categoryid={item.category}
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
        people={item.people || 0} // Use the aggregated people count
        navigation={navigation}
        item={item}
        status={statusLabel}
        onDeleteQueue={fetchQueueList} // Pass the refresh function
      />
    );
  };

  const renderTab = (tabName, label) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === tabName ? styles.activeTab : styles.inactiveTab]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={[styles.tabText, activeTab === tabName ? styles.activeTabText : styles.inactiveTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[AppStyles.root]}>
        <ActivityIndicator size="large" color={colors.primary} style={AppStyles.loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[AppStyles.root]}>
      <View style={styles.tabContainer}>
        {renderTab('all', 'All')}
        {renderTab('running', 'Running')}
        {renderTab('cancel', 'Cancel')}
      </View>

      <FlatList
        data={filteredQueues}
        renderItem={renderQueueItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: verticalScale(10),
    backgroundColor: colors.backgroundColor,
  },
  tab: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: verticalScale(16),
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  inactiveTab: {
    backgroundColor: colors.gray,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.white,
  },
  inactiveTabText: {
    color: colors.black,
  },
});

export default MyQueue;