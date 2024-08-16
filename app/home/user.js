import { Pressable, StyleSheet, Text, View, Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import moment from 'moment';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import axios from 'axios';
import { BASE_URL } from '../../settings/config';

const user = () => {

  const params = useLocalSearchParams();

  //console.log(params);

  const [currentDate, setCurrentDate] = useState(moment());

  const [attendanceStatus, setAttendanceStatus] = useState("present");

  const goToNextDate = () => {
    const nextDate = moment(currentDate).add(1, "days");
    setCurrentDate(nextDate);
  }

  const goToPreviousDate = () => {
    const previousDate = moment(currentDate).subtract(1, "days");
    setCurrentDate(previousDate);
  }

  const formatDate = (date) => {
    return date.format("MMMM  D, YYYY")
  }

  const handleSaveAttendance = async() => {
    try{
      const attendanceData = {
        employeeNo: params?.employeeNo,
        name: params?.name,
        date: currentDate.format("MMMM D, YYYY"),
        status: attendanceStatus,
      };

      console.log(attendanceData);
      
      const response = await axios.post(`${BASE_URL}/saveAttendance`, attendanceData);

      if(response.status == 200){
        Alert.alert(`The attendance of ${params?.name} has been saved successfully.`);
      }
    }
    catch(error){
      Alert.alert("The attendance has not been saved successfully.");
      console.log("Error occured while saving attendance data", error)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginLeft: "auto", marginRight: "auto", marginVertical: 20 }}>
        <AntDesign onPress={goToPreviousDate} name="left" size={24} color="black" />
        <Text>{formatDate(currentDate)}</Text>

        <AntDesign onPress={goToNextDate} name="right" size={24} color="black" />
      </View>

      <Pressable style={{ marginVertical: 10, marginHorizontal: 12, flexDirection: "row", gap: 10 }}>
        <View style={{ width: 50, height: 50, borderRadius: 8, padding: 10, backgroundColor: "#4b6cb7", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "white", fontSize: 16 }}>{params?.name?.charAt(0)}</Text>
        </View>

        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{params?.name}</Text>
          <Text style={{ marginTop: 5, color: "gray" }}>{params?.designation} ({params?.employeeNo})</Text>
        </View>
      </Pressable>

      <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 12 }}>
        Salary Rs: {params?.salary}
      </Text>

      <View style={{ marginHorizontal: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "500", letterSpacing: 3, marginTop: 7 }}>Attendance: </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginVertical: 10 }}>
          {/* Start - present */}
          <Pressable
            onPress={() => setAttendanceStatus("present")}
            style={{
              backgroundColor: "#C4E0E5",
              padding: 10,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
            }}
          >
            {attendanceStatus === "present" ? (
              <FontAwesome name="dot-circle-o" size={24} color="black" />
            ) : (
              <Entypo name="circle" size={24} color="black" />
            )}
            <Text style={{ marginLeft: 10 }}>Present</Text>
          </Pressable>
          {/* End - present */}


          {/* Start - absent */}
          <Pressable
            onPress={() => setAttendanceStatus("absent")}
            style={{
              backgroundColor: "#C4E0E5",
              padding: 10,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
            }}
          >
            {attendanceStatus === "absent" ? (
              <FontAwesome name="dot-circle-o" size={24} color="black" />
            ) : (
              <Entypo name="circle" size={24} color="black" />
            )}
            <Text style={{ marginLeft: 10 }}>Absent</Text>
          </Pressable>
          {/* End - absent */}
        </View>

        <Pressable onPress={handleSaveAttendance} style={{ backgroundColor: "#2196F3", padding: 10, marginTop: 20, justifyContent: "center", alignItems: "center", borderRadius: 5 }}>
          <Text style={{ fontWeight: "bold", color: "white" }}>Save</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default user

const styles = StyleSheet.create({})