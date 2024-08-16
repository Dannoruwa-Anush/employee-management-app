import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';

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
      const response = await axios.get(`http://192.168.8.124:3000/getAllPaySheetsByYearMonth`, {
        params: {
          month: currentDate.month() + 1, // Month in MongoDB is 1-based
          year: currentDate.year(),
        },
      });

      setPaySheetData(response.data);
    } catch (error) {
      console.log("Error occured while fetching paysheet by year-month", error);
    }
  };

  useEffect(() => {
    fetchPaySheetByYearMonth();
  }, [currentDate]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginLeft: "auto", marginRight: "auto", marginVertical: 20 }}>
        <AntDesign onPress={goToPreviousMonth} name="left" size={24} color="black" />
        <Text>{formatDate(currentDate)}</Text>

        <AntDesign onPress={goToNextMonth} name="right" size={24} color="black" />
      </View>

      <View style={{ marginHorizontal: 12 }}>
        {paySheetData.length === 0 ? (
          <Text style={{
            textAlign: 'center',
            marginVertical: 20,
            fontSize: 16,
            color: 'gray',
          }}>No pay sheet data available</Text>
        ) : (
          paySheetData.map((item, index) => (
            <View key={index} style={{ marginVertical: 10 }}>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={{ width: 50, height: 50, borderRadius: 8, padding: 10, backgroundColor: "#4b6cb7", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "white", fontSize: 16 }}>{item?.name?.charAt(0)}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item?.name}</Text>
                  <Text style={{ marginTop: 5, color: "gray" }}>{item?.designation} ({item?.employeeNo})</Text>
                </View>
              </View>

              {item?.salary && (
                <View style={{ width: 50, height: 50, borderRadius: 8, padding: 10, backgroundColor: "#7FFFD4", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 16, color: "black", fontWeight: "bold" }}>
                    {item.salary}
                  </Text>
                </View>
              )}
              
            </View>
          ))
        )}
      </View>
    </ScrollView>
  )
}

export default calculateSalary

const styles = StyleSheet.create({})