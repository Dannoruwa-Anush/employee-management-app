import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';
import ResultList from '../../components/ResultList';

const employeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEmployeeList = async () => {
      try {
        const response = await axios.get("http://192.168.8.124:3000/getAllEmployees");
        setEmployees(response.data);
      } catch (error) {
        console.log("Error occured while fetching employee data", error);
      }
    }
    fetchEmployeeList();
  }, []);

  console.log(employees);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "white" }}>
        <Ionicons style={{ marginLeft: 10 }} name="arrow-back" size={24} color="black" />
        <Pressable style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 7, gap: 10, backgroundColor: "white", height: 40, borderRadius: 4, flex: 1 }}>
          <Ionicons name="search-outline" size={24} color="black" />
          <TextInput value={newEmployee} onChangeText={(text) => setNewEmployee(text)} style={{ flex: 1 }} placeholder='Search' />

          {employees.length > 0 && (
            <View>
              <Pressable onPress={() => router.push("/home/addEmployee")}>
                <FontAwesome name="user-plus" size={24} color="black" />
              </Pressable>
            </View>
          )}
        </Pressable>
      </View>

      {employees.length > 0 ? (
        <ResultList data={employees} newEmployee={newEmployee} setEmployees={setEmployees} />
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>No Data</Text>
          <Text>Press on the plus button to add data</Text>
          <Pressable onPress={() => router.push("/home/addEmployee")}>
            <FontAwesome style={{ marginTop: 30 }} name="user-plus" size={24} color="black" />
          </Pressable>
        </View>
      )}
    </View>
  )
}

export default employeeList

const styles = StyleSheet.create({})