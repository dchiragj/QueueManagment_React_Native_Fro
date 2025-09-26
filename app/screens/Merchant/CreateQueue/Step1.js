// import React from 'react';
// import { View, Text, SafeAreaView, StyleSheet, TextInput } from 'react-native';
// import NavigationOptions from '@app/app/components/NavigationOptions';
// import { colors } from '@app/app/styles';
// import ScrollableAvoidKeyboard from '@app/app/components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
// import AppStyles from '@app/app/styles/AppStyles';
// import TextView from '@app/app/components/TextView/TextView';
// import FormGroup from '@app/app/components/FormGroup';
// import Input from '@app/app/components/Input';
// import { verticalScale, scale } from 'react-native-size-matters';
// import Picker from '@app/app/components/Picker';
// import { QueueCategory, Desks } from '@app/app/data/raw';
// import DatePicker from '../../../components/DatePicker';
// import { borderRadius } from '@app/app/styles/dimensions';
// import { Button } from '@app/app/components/Button';
// import screens from '../../../constants/screens';
// const Step1 = (props) => {
//   const onPressStep2 = () => {
//     props.navigation.navigate(screens.Step2);
//   };
//   return (
//     <SafeAreaView style={AppStyles.root}>
//       <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
//         <TextView text={'Queue Details'} type={'body-one'} isTextColorWhite={true} style={[AppStyles.titleStyle]} />
//         <FormGroup style={[AppStyles.formContainer, s.firstFormWrapper]}>
//           <Input returnKeyType={'next'} placeholder='Enter Queue Name' isIconLeft={true} leftIconName={'create'} />
//         </FormGroup>
//         <FormGroup>
//           <Picker
//             label={null}
//             isPlaceholderItem={true}
//             containerStyle={s.fullborderBox}
//             data={QueueCategory}
//             itemKeyField={'value'}
//             itemValueField={'text'}
//             isLeftIcon={true}
//             leftIconName={'search'}
//           />
//         </FormGroup>
//         <View style={s.topBorder} />
//         <View style={s.dateWrapper}>
//           <TextView
//             style={s.dateTextHeader}
//             text={'Queue Time Period Start To End'}
//             type={'body-one'}
//             isTextColorWhite={true}
//           />
//           <View style={s.DatePickerWrapper}>
//             <DatePicker style={s.DatePicker} containerStyle={s.containerStyle} />
//             <DatePicker style={s.DatePicker} containerStyle={s.containerStyle} />
//           </View>
//         </View>
//         <View style={s.topBorder} />
//         <View style={s.tokenWrapper}>
//           <View style={s.tokenOption}>
//             <TextView
//               style={s.tokenNumberText}
//               text={'Token starts with 01 to'}
//               type={'body-one'}
//               color={colors.white}
//             />
//             <Input returnKeyType={'next'} placeholder='50' wrapperStyle={s.wrapperStyle} style={s.inputPlaceholder} />
//           </View>
//           <View style={s.tokenOption}>
//             <TextView style={s.tokenNumberText} text={'Choose No Of Desks'} type={'body-one'} color={colors.white} />
//             <Picker
//               label={null}
//               isPlaceholderItem={true}
//               containerStyle={s.secondPickerContainerStyle}
//               data={Desks}
//               itemKeyField={'value'}
//               itemValueField={'text'}
//             />
//           </View>
//         </View>
//         <View style={s.topBorder} />
//         <TextView style={s.locationHeader} text={'Add Queue Location'} type={'body-one'} isTextColorWhite={true} />
//         <Input
//           returnKeyType={'next'}
//           placeholder='Enter Address'
//           isIconLeft={true}
//           leftIconName={'location'}
//           isIconRight={true}
//           rightIconName={'locate'}
//           style={s.addressInput}
//           wrapperStyle={s.addressInputWrapperStyle}
//         />
//         <View style={s.topBorder} />
//         <Input
//           returnKeyType={'done'}
//           placeholder='Queue Description'
//           isIconLeft={true}
//           leftIconName={'create'}
//           multiline={true}
//           numberOfLines={5}
//           style={s.queueInput}
//           iconStyle={s.iconInput}
//           wrapperStyle={[s.addressInputWrapperStyle]}
//         />
//         <Button
//           ButtonText='Next'
//           style={[s.btn, AppStyles.btnStyle]}
//           animationStyle={[s.btn, AppStyles.btnStyle]}
//           isIconRight={true}
//           rightIconName={'arrow-forward'}
//           onPress={onPressStep2}
//         />
//       </ScrollableAvoidKeyboard>
//     </SafeAreaView>
//   );
// };
// Step1.navigationOptions = ({ navigation }) => {
//   return NavigationOptions({
//     title: '',
//     isBack: true,
//     navigation: navigation,
//     headerStyle: { elevation: 0 }
//   });
// };
// const s = StyleSheet.create({
//   firstFormWrapper: {
//     marginTop: verticalScale(30)
//   },
//   topBorder: {
//     borderWidth: 0.5,
//     borderColor: colors.lightWhite,
//     marginTop: scale(30),
//     marginHorizontal: scale(15)
//   },
//   dateWrapper: {
//     marginTop: verticalScale(30)
//   },
//   dateTextHeader: {
//     textAlign: 'center'
//   },
//   DatePickerWrapper: {
//     flexDirection: 'row',
//     marginTop: verticalScale(15),
//     justifyContent: 'space-around'
//   },
//   DatePicker: {
//     marginRight: scale(120)
//   },
//   containerStyle: {
//     marginLeft: scale(5)
//   },
//   tokenWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: verticalScale(20),
//     justifyContent: 'center',
//     borderRadius: borderRadius
//   },
//   tokenOption: {
//     width: '45%',
//     paddingHorizontal: scale(20),
//     marginTop: verticalScale(10),
//     marginHorizontal: scale(5),
//     borderWidth: 1,
//     borderColor: colors.white,
//     borderRadius: borderRadius
//   },
//   tokenNumberText: {
//     marginTop: verticalScale(7),
//     textAlign: 'center'
//   },
//   wrapperStyle: {
//     marginTop: verticalScale(10),
//     marginHorizontal: scale(25)
//   },
//   inputPlaceholder: {
//     textAlign: 'center',
//     color: colors.white
//   },
//   secondPickerContainerStyle: {
//     marginTop: verticalScale(10),
//     marginLeft: scale(-7)
//   },
//   locationHeader: {
//     textAlign: 'center',
//     marginTop: verticalScale(30)
//   },
//   addressInput: {
//     color: colors.white
//   },
//   addressInputWrapperStyle: {
//     marginVertical: verticalScale(30)
//   },
//   queueInput: {
//     color: colors.white,
//     textAlignVertical: 'top'
//   },
//   iconInput: {
//     alignSelf: 'flex-start',
//     paddingTop: 10
//   },
//   btn: {
//     marginTop: verticalScale(50),
//     marginBottom: verticalScale(40)
//   }
// });
// export default Step1;
// screens/Step1.js


import TextView from '@app/app/components/TextView/TextView';
import { colors } from '@app/app/styles';
import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert } from 'react-native';
import NavigationOptions from '@app/app/components/NavigationOptions';
import ScrollableAvoidKeyboard from '@app/app/components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import AppStyles from '@app/app/styles/AppStyles';
import FormGroup from '@app/app/components/FormGroup';
import Input from '@app/app/components/Input';
import { verticalScale, scale } from 'react-native-size-matters';
import Picker from '@app/app/components/Picker';
import { QueueCategory, Desks, Problems, Solutions } from '@app/app/data/raw';
import DatePicker from '../../../components/DatePicker';
import { borderRadius, indent } from '@app/app/styles/dimensions';
import { Button } from '@app/app/components/Button';
import screens from '../../../constants/screens';
import { createQueue, getQueueList } from '@app/app/services/apiService';

const Step1 = ({ navigation }) => {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    description: '',
    start_date: null,
    end_date: null,
    noOfDesk: null,
    start_number: 1,
    end_number: 50,
    address: '',
    deskDetails: [],
    problems: [],
    solutions: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState({});

  const formatDateForSQL = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return null;
    return date.toISOString().slice(0, 19).replace('T', ' '); // YYYY-MM-DD HH:mm:ss
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.start_date || !(formData.start_date instanceof Date) || isNaN(formData.start_date)) {
      newErrors.start_date = 'Valid start date is required';
    }
    if (!formData.end_date || !(formData.end_date instanceof Date) || isNaN(formData.end_date)) {
      newErrors.end_date = 'Valid end date is required';
    }
    if (
      formData.end_date &&
      formData.start_date &&
      formData.end_date instanceof Date &&
      formData.start_date instanceof Date &&
      formData.end_date <= formData.start_date
    ) {
      newErrors.end_date = 'End date must be after start date';
    }
    if (!formData.start_number || formData.start_number < 1) {
      newErrors.start_number = 'Start number must be a positive integer';
    }
    if (!formData.end_number || formData.end_number <= formData.start_number) {
      newErrors.end_number = 'End number must be greater than start number';
    }
    if (!formData.address) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const onSubmit = async () => {
  if (!validateForm()) {
    Alert.alert('Validation Error', 'Please fix the errors in the form');
    return;
  }

  setLoading(true);
  try {
    const payload = {
      ...formData,
      category: formData.category.toString(),
      start_date: formatDateForSQL(new Date(formData.start_date)),
      end_date: formatDateForSQL(new Date(formData.end_date)),
    };
    console.log(payload,"play");
    
    const response = await createQueue(payload);
    console.log(response,"res");
    
    Alert.alert('Success', 'Queue created successfully! QR code has been sent to your email.');
    // Fetch latest queues
    const queue = await getQueueList();
    // Navigate & pass queues to MyQueue
    navigation.navigate('MyQueue', { queues: queue.data ?? [] });
  } catch (error) {
    console.error('Submit error:', error.message);
    setResError({ error: error.message || 'Failed to create queue' });
    Alert.alert('Error', error.message || 'Failed to create queue');
  } finally {
    setLoading(false);
  }
};

  const onStartDateChange = (date) => {
    let parsedDate = date;
    if (typeof date === 'string') {
      parsedDate = new Date(date);
    }
    if (parsedDate && !isNaN(parsedDate)) {
      setFormData({ ...formData, start_date: parsedDate });
    } else {
      console.warn('Invalid start date:', date);
      setErrors({ ...errors, start_date: 'Invalid date format' });
    }
  };

  const onEndDateChange = (date) => {
    let parsedDate = date;
    if (typeof date === 'string') {
      parsedDate = new Date(date);
    }
    if (parsedDate && !isNaN(parsedDate)) {
      setFormData({ ...formData, end_date: parsedDate });
    } else {
      console.warn('Invalid end date:', date);
      setErrors({ ...errors, end_date: 'Invalid date format' });
    }
  };

  const handleNoOfDeskChange = (value) => {
    const deskValue = parseInt(value);
    const newDeskDetails = Array.from({ length: deskValue }, (_, i) => ({
      username: `Desk ${i + 1}`,
    }));
    setFormData({ ...formData, noOfDesk: deskValue, deskDetails: newDeskDetails });
  };

  const updateDeskDetail = (index, username) => {
    const newDeskDetails = [...formData.deskDetails];
    newDeskDetails[index] = { ...newDeskDetails[index], username };
    setFormData({ ...formData, deskDetails: newDeskDetails });
  };

  const handleProblemsChange = (value) => {
    setFormData({ ...formData, problems: value });
  };

  const handleSolutionsChange = (value) => {
    setFormData({ ...formData, solutions: value });
  };

  return (
    <SafeAreaView style={AppStyles.root}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <TextView text={'Queue Details'} type={'body-one'} isTextColorWhite={true} style={[AppStyles.titleStyle]} />
        <FormGroup style={[AppStyles.formContainer, s.firstFormWrapper]}>
          <Input
            returnKeyType={'next'}
            placeholder='Enter Queue Name'
            isIconLeft={true}
            leftIconName={'create'}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            error={errors.name}
            editable={!loading}
          />
        </FormGroup>
        <FormGroup>
          <Picker
            label={null}
            isPlaceholderItem={true}
            containerStyle={s.fullborderBox}
            data={QueueCategory}
            itemKeyField={'text'}
            itemValueField={'text'}
            isLeftIcon={true}
            leftIconName={'search'}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            value={formData.category}
            enabled={!loading}
          />
          {errors.category && <Text style={s.errorText}>{errors.category}</Text>}
        </FormGroup>
        <View style={s.topBorder} />
        <View style={s.dateWrapper}>
          <TextView
            style={s.dateTextHeader}
            text={'Queue Time Period Start To End'}
            type={'body-one'}
            isTextColorWhite={true}
          />
          <View style={s.DatePickerWrapper}>
            <View style={s.containerStyle}>
              <DatePicker
                style={s.DatePicker}
                containerStyle={s.containerStyle}
                onDateChange={onStartDateChange}
                placeholder="Start Date"
                selectedDate={formData.start_date}
                disabled={loading}
              />
              {errors.start_date && <Text style={s.errorText}>{errors.start_date}</Text>}
            </View>
            <View style={s.containerStyle}>
              <DatePicker
                style={s.DatePicker}
                containerStyle={s.containerStyle}
                onDateChange={onEndDateChange}
                placeholder="End Date"
                selectedDate={formData.end_date}
                disabled={loading}
              />
              {errors.end_date && <Text style={s.errorText}>{errors.end_date}</Text>}
            </View>
          </View>
        </View>
        <View style={s.topBorder} />
        <View style={s.tokenWrapper}>
          <View style={s.tokenOption}>
            <TextView
              style={s.tokenNumberText}
              text={'Token starts with 01'}
              type={'body-one'}
              color={colors.white}
            />
            <Input
              returnKeyType={'next'}
              placeholder='50'
              wrapperStyle={s.wrapperStyle}
              style={s.inputPlaceholder}
              value={formData.start_number.toString()}
              onChangeText={(text) => setFormData({ ...formData, start_number: parseInt(text)|| 0})}
              keyboardType="numeric"
              error={errors.start_number}
              editable={!loading}
            />
          </View>
        </View>
        {formData.noOfDesk > 0 && (
          <View style={s.deskDetailsWrapper}>
            <TextView
              style={s.deskDetailsHeader}
              text={'Desk Details'}
              type={'body-one'}
              isTextColorWhite={true}
            />
            {formData.deskDetails.map((desk, index) => (
              <FormGroup key={index} style={s.deskDetailItem}>
                <Input
                  returnKeyType={'next'}
                  placeholder={`Desk ${index + 1} Username`}
                  value={desk.username}
                  onChangeText={(text) => updateDeskDetail(index, text)}
                  error={errors.deskDetails}
                  editable={!loading}
                />
              </FormGroup>
            ))}
            {errors.deskDetails && <Text style={s.errorText}>{errors.deskDetails}</Text>}
          </View>
        )}
        
        <View style={s.topBorder} />
        <TextView style={s.locationHeader} text={'Add Queue Location'} type={'body-one'} isTextColorWhite={true} />
        <Input
          returnKeyType={'next'}
          placeholder='Enter Address'
          isIconLeft={true}
          leftIconName={'location'}
          isIconRight={true}
          rightIconName={'locate'}
          style={s.addressInput}
          wrapperStyle={s.addressInputWrapperStyle}
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          error={errors.address}
          editable={!loading}
        />
        {/* <View style={s.topBorder} /> */}
        <Input
          returnKeyType={'done'}
          placeholder='Queue Description'
          isIconLeft={true}
          leftIconName={'create'}
          multiline={true}
          numberOfLines={5}
          style={s.queueInput}
          iconStyle={s.iconInput}
          wrapperStyle={[s.addressInputWrapperStyle]}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          error={errors.description}
          editable={!loading}
        />
        <Button
          ButtonText='Submit'
          style={[s.btn, AppStyles.btnStyle]}
          animationStyle={[s.btn, AppStyles.btnStyle]}
          isIconRight={true}
          rightIconName={'arrow-forward'}
          onPress={onSubmit}
          isLoading={loading}
          disabled={loading}
        />
      </ScrollableAvoidKeyboard>
    </SafeAreaView>
  );
};

Step1.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: true,
    navigation: navigation,
    headerStyle: { elevation: 0 },
  });
};

const s = StyleSheet.create({
  firstFormWrapper: {
    marginTop: verticalScale(30),
  },
  topBorder: {
    borderWidth: 0.5,
    borderColor: colors.lightWhite,
    marginTop: scale(30),
    marginHorizontal: scale(15),
  },
  dateWrapper: {
    marginTop: verticalScale(30),
  },
  dateTextHeader: {
    textAlign: 'center',
  },
  DatePickerWrapper: {
    flexDirection: 'row',
    marginTop: verticalScale(15),
    justifyContent: 'space-around',
  },
  DatePicker: {
    marginRight: scale(120),
  },
  containerStyle: {
    marginLeft: scale(5),
    flex: 1,
  },
  dateText: {
    color: colors.white,
    fontSize: scale(14),
    marginTop: verticalScale(5),
    textAlign: 'center',
  },
  tokenWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(20),
    justifyContent: 'center',
    borderRadius: borderRadius,
  },
  tokenOption: {
    width: '45%',
    paddingHorizontal: scale(20),
    marginTop: verticalScale(10),
    marginHorizontal: scale(5),
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: borderRadius,
  },
  tokenNumberText: {
    marginTop: verticalScale(7),
    textAlign: 'center',
  },
  wrapperStyle: {
    marginTop: verticalScale(10),
    marginHorizontal: scale(25),
  },
  inputPlaceholder: {
    textAlign: 'center',
    color: colors.white,
  },
  secondPickerContainerStyle: {
    marginTop: verticalScale(10),
    marginLeft: scale(-7),
  },
  deskDetailsWrapper: {
    marginTop: verticalScale(20),
    marginHorizontal: scale(15),
  },
  deskDetailsHeader: {
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  deskDetailItem: {
    marginBottom: verticalScale(10),
  },
  problemSolutionWrapper: {
    marginTop: verticalScale(20),
    marginHorizontal: scale(15),
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  locationHeader: {
    textAlign: 'center',
    marginTop: verticalScale(30),
  },
  addressInput: {
    color: colors.white,
  },
  addressInputWrapperStyle: {
    marginVertical: verticalScale(20),
  },
  queueInput: {
    color: colors.white,
    textAlignVertical: 'top',
  },
  iconInput: {
    alignSelf: 'flex-start',
    paddingTop: 10,
  },
  btn: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(40),
  },
  btnStyle: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(20),
    marginTop: verticalScale(indent),
    borderRadius: borderRadius,
  },
  errorText: {
    color: colors.red,
    fontSize: scale(12),
    marginTop: verticalScale(5),
    marginLeft: scale(15),
  },
});

export default Step1;