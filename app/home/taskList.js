import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import moment from 'moment';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { router, useRouter } from 'expo-router';
import ResultList from '../../components/ResultList';
import { BASE_URL } from '../../settings/config';

const taskList = () => {

  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(moment());

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

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
      const fetchEmployeeList = async () => {
          try {
              const response = await axios.get(`${BASE_URL}/getAllEmployees`);
              setEmployees(response.data);
          } catch (error) {
              console.log("Error occured while fetching employee data", error);
          }
      }
      fetchEmployeeList();
  }, []);

  const [task, setTask] = useState([]);

  const fetchTaskByDate = async () => {
      try {
          const response = await axios.get(`${BASE_URL}/getAllTaskByDate`, {
              params: {
                  date: currentDate.format("MMMM D, YYYY"),
              },
          });
          setTask(response.data);
      } catch (error) {
          console.log("Error occured while fetching task by date", error);
      }
  };

  //console.log(task);

  useEffect(() => {
    fetchTaskByDate();
  }, [currentDate]);

  const employeeWithTask = employees.map((employee) => {
      const taskRecord = task.find((record) => 
          record.employeeNo === employee.employeeNo
      );
  
      return {
          ...employee,
          taskName:   taskRecord ? taskRecord.taskName : "",
          taskStatus: taskRecord ? taskRecord.taskStatus : "",
      };
  });
  
  //console.log(employeeWithTask);

  return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
          <Pressable>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginLeft: "auto", marginRight: "auto", marginVertical: 20 }}>
                  <AntDesign onPress={goToPreviousDate} name="left" size={24} color="black" />
                  <Text>{formatDate(currentDate)}</Text>

                  <AntDesign onPress={goToNextDate} name="right" size={24} color="black" />
              </View>

              <View style={{ marginHorizontal: 12 }}>
                  {employeeWithTask.map((item, index) => (
                      <Pressable
                          key={index} style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 10 }}>
                          <View style={{ width: 80, height: 80, borderRadius: 8, padding: 10, backgroundColor: "#4b6cb7", alignItems: "center", justifyContent: "center" }}>
                              <Text style={{ color: "white", fontSize: 16 }}>{item?.name?.charAt(0)}</Text>
                          </View>

                          <View style={{flex: 1}}>
                              <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item?.name}</Text>
                              <Text style={{ marginTop: 5, color: "gray" }}>{item?.taskName}</Text>
                              <Text style={{ marginTop: 5, color: "gray" }}>{item?.designation} ({item?.employeeNo})</Text>
                          </View>

                          {item?.taskStatus && (
                              <View style={{ width: 50, height: 50, borderRadius: 8, padding: 10, backgroundColor: "#7FFFD4", alignItems: "center", justifyContent: "center" }}>
                                  <Text style={{ fontSize: 16, color: "black", fontWeight: "bold" }}>
                                      {item.taskStatus.charAt(0)}
                                  </Text>
                              </View>
                          )}
                      </Pressable>
                  ))}
              </View>
          </Pressable>
      </View>
  )
}

export default taskList

const styles = StyleSheet.create({})