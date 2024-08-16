import { View, Text, ScrollView, TextInput, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'expo-router';

const addEmployee = () => {
    const [employeeNo, setEmployeeNo] = useState("");
    const [name, setName] = useState("");
    const [nic, setNIC] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [address, setAddress] = useState("");
    const [designation, setDesignation] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [salary, setSalary] = useState("");

    const router = useRouter();

    const handleSave = () =>{
        //---[Start: input field validation]----
        if (!employeeNo || !name || !nic || !dateOfBirth || !phoneNo || !address || !designation || !joiningDate || !salary) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }
        //---[End: input field validation]-------

        const employeeData = {
            employeeNo  :employeeNo,
            name        :name,
            nic         :nic,
            dateOfBirth :dateOfBirth,
            phoneNo     :phoneNo,
            address     :address,
            designation :designation,
            joiningDate :joiningDate,
            salary      :salary,
            active      : true, //set to TRUE
        };
        
        axios.post("http://192.168.8.124:3000/saveEmployee", employeeData).then((response) => {
            Alert.alert("The employee has been saved successfully.");

            setEmployeeNo("");
            setName("");
            setNIC("");
            setDateOfBirth("");
            setPhoneNo("");
            setAddress("");
            setDesignation("");
            setJoiningDate("");
            setSalary("");

            router.push('/home/employeeList'); //Navigate to employeeList
        }).catch((error) => {
            Alert.alert("The employee has not been saved successfully.");
            console.log("Error occured while saving employee data", error)
        });
    }

    return (
        <ScrollView>
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 17, fontWeight: "bold" }}>Employee Details</Text>

                <View style={{ padding: 15 }}>
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Employee No</Text>
                        <TextInput value={employeeNo} onChangeText={(text) => setEmployeeNo(text)} style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }} placeholder='Employee No' placeholderTextColor={"black"} />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Name</Text>
                        <TextInput value={name} onChangeText={(text) => setName(text)} style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }} placeholder='Name' placeholderTextColor={"black"} />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>NIC</Text>
                        <TextInput value={nic} onChangeText={(text) => setNIC(text)} style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }} placeholder='NIC' placeholderTextColor={"black"} />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Date of Birth</Text>
                        <TextInput value={dateOfBirth} onChangeText={(text) => setDateOfBirth(text)} style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }} placeholder='Date of Birth' placeholderTextColor={"black"} />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Phone No</Text>
                        <TextInput value={phoneNo} onChangeText={(text) => setPhoneNo(text)} style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }} placeholder='Phone No' placeholderTextColor={"black"} />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Address</Text>
                        <TextInput value={address} onChangeText={(text) => setAddress(text)} style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }} placeholder='Address' placeholderTextColor={"black"} />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Designation</Text>
                        <TextInput value={designation} onChangeText={(text) => setDesignation(text)} style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }} placeholder='Designation' placeholderTextColor={"black"} />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Joining Date</Text>
                        <TextInput value={joiningDate} onChangeText={(text) => setJoiningDate(text)} style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }} placeholder='Joining Date' placeholderTextColor={"black"} />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Salary</Text>
                        <TextInput value={salary} onChangeText={(text) => setSalary(text)} style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }} placeholder='Salary' placeholderTextColor={"black"} />
                    </View>

                    <Pressable onPress={handleSave} style={{backgroundColor:"#2196F3", padding:10, marginTop:20, justifyContent:"center", alignItems:"center", borderRadius: 5}}>
                        <Text style={{fontWeight:"bold", color:"white"}}>Save</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    )
}

export default addEmployee