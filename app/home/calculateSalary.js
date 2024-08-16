import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { BASE_URL } from '../../settings/config';

const calculateSalary = () => {
  const [paySheetData, setPaySheetData] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment());

  const goToNextMonth = () => {
    const nextMonth = moment(currentDate).add(1, "months");
    setCurrentDate(nextMonth);
  }

  const goToPreviousMonth = () => {
    const previousMonth = moment(currentDate).subtract(1, "months");
    setCurrentDate(previousMonth);
  }

  const formatDate = (date) => {
    return date.format("MMMM, YYYY")
  }

  const fetchPaySheetByYearMonth = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getAllPaySheetsByYearMonth`, {
        params: {
          month: currentDate.month() + 1, // Month in MongoDB is 1-based
          year: currentDate.year(),
        },
      });

      // Convert salary to string for rendering
      const updatedData = response.data.map((item) => ({
        ...item,
        salary: item.salary.$numberDecimal.toString(), // Convert salary object to string
      }));

      setPaySheetData(updatedData);
    } catch (error) {
      console.log("Error occured while fetching paysheet by year-month", error);
    }
  };

  //console.log(paySheetData);

  useEffect(() => {
    fetchPaySheetByYearMonth();
  }, [currentDate]);


  const handleCalculateSalary = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/calculateSalaryForAllByYearMonth`, {
        month: currentDate.month() + 1, // Month in MongoDB is 1-based
        year: currentDate.year(),
      });

      if (response.status === 200) {
        Alert.alert('The monthly salary has been calculated successfully.');
      }
    } catch (error) {
      console.log("Error occurred while calculating monthly salary for all employees", error);
      Alert.alert("Error occurred while calculating monthly salary for all employees");
    }
  };


  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 'auto', marginRight: 'auto', marginVertical: 20 }}>
        <AntDesign onPress={goToPreviousMonth} name="left" size={24} color="black" />
        <Text>{formatDate(currentDate)}</Text>
        <AntDesign onPress={goToNextMonth} name="right" size={24} color="black" />
      </View>

      <View style={{ marginHorizontal: 12 }}>
        <Pressable onPress={handleCalculateSalary} style={{ backgroundColor: '#2196F3', padding: 10, marginTop: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
          <Text style={{ fontWeight: 'bold', color: 'white' }}>Calculate</Text>
        </Pressable>
      </View>

      <View style={{ marginHorizontal: 12, marginTop: 40}}>
        {paySheetData.length === 0 ? (
          <Text style={{ textAlign: 'center', marginVertical: 20, fontSize: 16, color: 'gray' }}>
            No pay sheet data available
          </Text>
        ) : (
          paySheetData.map((item, index) => (
            <View key={index} style={{ marginVertical: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 50, height: 50, borderRadius: 8, padding: 10, backgroundColor: '#4b6cb7', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 16 }}>{item?.employeeName?.charAt(0)}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item?.employeeName}</Text>
                  <Text style={{ marginTop: 5, color: 'gray' }}>{item?.employeeNo}</Text>
                </View>

                {item?.salary && (
                  <View style={{ width: 150, height: 50, borderRadius: 8, padding: 10, backgroundColor: '#7FFFD4', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
                        Rs.
                      </Text>
                      <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
                        {item.salary}
                      </Text>
                    </View>
                  </View>
                )}

              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  )
}

export default calculateSalary

const styles = StyleSheet.create({})