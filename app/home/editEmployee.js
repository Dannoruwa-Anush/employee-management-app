import { StyleSheet, View, Text, ScrollView, TextInput, Pressable, Alert, Platform } from 'react-native';
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import axios from 'axios';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../../settings/config';

const editEmployee = () => {
    const params = useLocalSearchParams();

    const [employeeData, setEmployeeData] = useState({});

    const [employeeNo, setEmployeeNo] = useState("");
    const [name, setName] = useState("");
    const [nic, setNIC] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [address, setAddress] = useState("");
    const [designation, setDesignation] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [salary, setSalary] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentDateType, setCurrentDateType] = useState(''); // 'DOB' or 'Joining'

    const router = useRouter();

    useEffect(() => {
        const fetchEmployeeObject = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/getEmployeeById/${params.id}`);
                setEmployeeData(response.data);
            } catch (error) {
                console.log("Error occured while fetching employee data", error);
            }
        }
        fetchEmployeeObject();
    }, [params.id]);

    //console.log(employeeData);
    
    useEffect(() => {
        if (employeeData) {
            setEmployeeNo(employeeData.employeeNo || '');
            setName(employeeData.name || '');
            setNIC(employeeData.nic || '');
            setDateOfBirth(employeeData.dateOfBirth ? formatDate(employeeData.dateOfBirth) : '');
            setPhoneNo(employeeData.phoneNo || '');
            setAddress(employeeData.address || '');
            setDesignation(employeeData.designation || '');
            setJoiningDate(employeeData.joiningDate ? formatDate(employeeData.joiningDate) : '');
            setSalary(employeeData.salary?.$numberDecimal || '');
        }
    }, [employeeData]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            if (currentDateType === 'DOB') {
                setDateOfBirth(formattedDate);
            } else if (currentDateType === 'Joining') {
                setJoiningDate(formattedDate);
            }
        }
    };

    const showDatePickerModal = (type) => {
        setCurrentDateType(type);
        setShowDatePicker(true);
    };

    const handleUpdate = async () => {
        if (!employeeNo || !name || !nic || !dateOfBirth || !phoneNo || !address || !designation || !joiningDate || !salary) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }

        const updatedEmployee = {
            employeeNo,
            name,
            nic,
            dateOfBirth,
            phoneNo,
            address,
            designation,
            joiningDate,
            salary,
            active: true, // Set to ACTIVE
        };

        try {
            await axios.put(`${BASE_URL}/updateEmployee/${params.id}`, updatedEmployee);
            Alert.alert("Success", "Employee updated successfully.");
            router.push('/home/employeeList');
        } catch (error) {
            Alert.alert("Error", "Failed to update employee.");
            console.error("Error occurred while updating employee data", error);
        }
    };

    return (
        <ScrollView>
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 17, fontWeight: "bold" }}>Employee Details</Text>

                <View style={{ padding: 15 }}>
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Employee No</Text>
                        <TextInput
                            value={employeeNo}
                            onChangeText={setEmployeeNo}
                            style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }}
                            placeholder='Employee No'
                            placeholderTextColor={"black"}
                        />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }}
                            placeholder='Name'
                            placeholderTextColor={"black"}
                        />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>NIC</Text>
                        <TextInput
                            value={nic}
                            onChangeText={setNIC}
                            style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }}
                            placeholder='NIC'
                            placeholderTextColor={"black"}
                        />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Date of Birth</Text>
                        <TextInput
                            value={dateOfBirth}
                            onFocus={() => showDatePickerModal('DOB')}
                            style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }}
                            placeholder='Date of Birth'
                            placeholderTextColor={"black"}
                            editable={true}
                        />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Phone No</Text>
                        <TextInput
                            value={phoneNo}
                            onChangeText={setPhoneNo}
                            style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }}
                            placeholder='Phone No'
                            placeholderTextColor={"black"}
                        />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Address</Text>
                        <TextInput
                            value={address}
                            onChangeText={setAddress}
                            style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }}
                            placeholder='Address'
                            placeholderTextColor={"black"}
                        />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Designation</Text>
                        <TextInput
                            value={designation}
                            onChangeText={setDesignation}
                            style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }}
                            placeholder='Designation'
                            placeholderTextColor={"black"}
                        />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Joining Date</Text>
                        <TextInput
                            value={joiningDate}
                            onFocus={() => showDatePickerModal('Joining')}
                            style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }}
                            placeholder='Joining Date'
                            placeholderTextColor={"black"}
                            editable={true}
                        />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Daily Wage</Text>
                        <TextInput
                            value={salary}
                            onChangeText={setSalary}
                            style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }}
                            placeholder='Salary'
                            placeholderTextColor={"black"}
                        />
                    </View>

                    <Pressable onPress={handleUpdate} style={{ backgroundColor: "#2196F3", padding: 10, marginTop: 20, justifyContent: "center", alignItems: "center", borderRadius: 5 }}>
                        <Text style={{ fontWeight: "bold", color: "white" }}>Update</Text>
                    </Pressable>
                </View>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </ScrollView>
    );
}

export default editEmployee

const styles = StyleSheet.create({})