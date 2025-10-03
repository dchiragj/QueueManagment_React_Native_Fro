// import Card from '@app/app/components/Card';
// import TextView from '@app/app/components/TextView/TextView';
// import { colors } from '@app/app/styles';
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { verticalScale, scale, moderateScale } from 'react-native-size-matters';

// const CompletedTokenListItem = (props) => {
//   return (
//     <Card style={s.wrapper} onPress={props.onPress}>
//       <View style={s.mainWrapper}>
//         <View style={s.numberTextWrapper}>
//           <TextView color={colors.primary} text={'11'} type={'sub-title'} style={s.numberText} />
//         </View>
//         <View style={s.textWrapper}>
//           <TextView color={colors.white} text={'Kiran Hospital'} type={'body-one '} />
//           <TextView color={colors.lightWhite} text={'Dr. Chintan B. Patel'} type={'body-one '} />
//           <TextView color={colors.lightWhite} text={'02 oct - 12:30 PM '} type={'body-one '} />
//         </View>
//         <View style={s.tokenStatusWrapper}>
//           <View style={s.tokenStatusTriangle}></View>
//           <View style={s.tokenStatusRectangle}></View>
//           <TextView color={colors.white} text={'Completed'} type={'body-One'} style={s.tokenStatusText} />
//         </View>
//       </View>
//     </Card>
//   );
// };
// const s = StyleSheet.create({
//   wrapper: {
//     paddingVertical: verticalScale(20),
//     marginBottom: verticalScale(10)
//   },
//   mainWrapper: {
//     flexDirection: 'row'
//   },
//   numberTextWrapper: {
//     flex: 0.3
//   },
//   numberText: {
//     borderWidth: 1,
//     borderColor: colors.primary,
//     marginLeft: scale(20),
//     borderRadius: 5,
//     padding: moderateScale(10),
//     textAlign: 'center'
//   },
//   textWrapper: {
//     marginLeft: scale(15),
//     flex: 0.4
//   },
//   tokenStatusWrapper: {
//     flex: 0.4,
//     flexDirection: 'row',
//     position: 'relative',
//     alignItems: 'flex-start',
//     justifyContent: 'flex-end'
//   },
//   tokenStatusTriangle: {
//     borderLeftWidth: 15.5,
//     borderRightWidth: 15.5,
//     borderBottomWidth: 18,
//     marginTop: verticalScale(6),
//     borderLeftColor: 'transparent',
//     borderRightColor: 'transparent',
//     borderBottomColor: colors.primary,
//     transform: [{ rotate: '270deg' }]
//   },
//   tokenStatusRectangle: {
//     width: scale(60),
//     backgroundColor: colors.primary,
//     marginLeft: -7,
//     height: verticalScale(30)
//   },
//   tokenStatusText: {
//     position: 'absolute',
//     marginTop: verticalScale(5)
//   }
// });
// export default CompletedTokenListItem;


import Card from '@app/app/components/Card';
import TextView from '@app/app/components/TextView/TextView';
import { getCategories, getTokenList } from '@app/app/services/apiService';
import { colors } from '@app/app/styles';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';

const CompletedTokenListItem = ( props ) => {
  const [ tokens, setTokens ] = useState( [] );
  const [ error, setError ] = useState( null );
  const [ categories, setCategories ] = useState( [] );

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const list = res?.data?.map( ( c ) => ( {
        text: c.name,
        value: c.id,
      } ) );
      setCategories( list || [] );
    } catch ( err ) {
      console.error( "Error fetching categories:", err );
      setCategories( [] );
    }
  };

  useEffect( () => {
    const fetchTokens = async () => {
      try {
        const response = await getTokenList();
        if ( response.data && Array.isArray( response.data.List ) ) {
          setTokens( response.data.List );
        } else if ( Array.isArray( response.data ) ) {
          setTokens( response.data );
        } else {
          setTokens( [] );
        }
      } catch ( err ) {
        console.error( "Failed to fetch tokens", err );
        setError( 'Failed to load tokens. Please try again later.' );
      }
    };

    fetchTokens();
    fetchCategories();
  }, [] );

  const formatDate = ( dateString ) => {
    if ( !dateString ) return ""; // safety

    const date = new Date( dateString );

    if ( isNaN( date ) ) return dateString; // fallback if invalid

    const day = date.getDate();
    const month = date.toLocaleString( "default", { month: "short" } );
    const time = date.toLocaleTimeString( [], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${ day } ${ month } - ${ time }`;
  };




  // Function to get category name by categoryId
  const getCategoryName = ( categoryId ) => {
    if ( categoryId === null || categoryId === undefined ) {
      return 'Category';
    }
    const category = categories.find( ( cat ) => cat.value === categoryId );
    return category ? category.text : ' Category';
  };

  return (
    <>
      { tokens.map( ( token, index ) => (
        <Card key={ index } style={ styles.wrapper } onPress={ props.onPress }>
          <View style={ styles.mainWrapper }>
            <View style={ styles.numberTextWrapper }>
              <TextView
                color={ colors.primary }
                text={ token.tokenNumber || 'N/A' }
                type="sub-title"
                style={ styles.numberText }
              />
            </View>
            <View style={ styles.textWrapper }>
              <TextView
                color={ colors.white }
                text={ token.queueName || 'Queue' }
                type="body-one"
              />
              <TextView
                color={ colors.lightWhite }
                text={ getCategoryName( token.categoryId ) }
                type="body-one"
              />
              <TextView
                color={ colors.lightWhite }
                text={ formatDate( token.createdAt ) }
                type="body-one"
              />
            </View>
            <View style={ styles.tokenStatusWrapper }>
              <View style={ styles.tokenStatusTriangle }></View>
              <View style={ styles.tokenStatusRectangle }></View>
              <TextView
                color={ colors.white }
                text={ token.status || 'Completed' }
                type="body-one"
                style={ styles.tokenStatusText }
              />
            </View>
          </View>
        </Card>
      ) ) }
    </>
  );
};

const styles = StyleSheet.create( {
  wrapper: {
    paddingVertical: verticalScale( 20 ),
    marginBottom: verticalScale( 10 ),
  },
  mainWrapper: {
    flexDirection: 'row',
  },
  numberTextWrapper: {
    flex: 0.3,
  },
  numberText: {
    borderWidth: 1,
    borderColor: colors.primary,
    marginLeft: scale( 20 ),
    borderRadius: 5,
    padding: moderateScale( 10 ),
    textAlign: 'center',
  },
  textWrapper: {
    marginLeft: scale( 15 ),
    flex: 0.4,
  },
  tokenStatusWrapper: {
    flex: 0.4,
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  tokenStatusTriangle: {
    borderLeftWidth: 15.5,
    borderRightWidth: 15.5,
    borderBottomWidth: 18,
    marginTop: verticalScale( 7.5 ),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.primary,
    transform: [ { rotate: '270deg' } ],
  },
  tokenStatusRectangle: {
    width: scale( 60 ),
    backgroundColor: colors.primary,
    marginLeft: -7,
    height: verticalScale( 30 ),
  },
  tokenStatusText: {
    position: 'absolute',
    marginTop: verticalScale( 5 ),
  },
  errorText: {
    color: colors.lightWhite,
    textAlign: 'center',
    marginTop: verticalScale( 10 ),
  },
} );
export default CompletedTokenListItem;