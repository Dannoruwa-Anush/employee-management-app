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
    const [dailyWage, setDailyWage] = useState("");
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
            setDailyWage(employeeData.dailyWage?.$numberDecimal || '');
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
        if (!employeeNo || !name || !nic || !dateOfBirth || !phoneNo || !address || !designation || !joiningDate || !dailyWage) {
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
            dailyWage,
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

    const handleDelete = async () => {
        try {
            // Confirm deletion with the user
            const confirmation = await new Promise((resolve) => {
                Alert.alert(
                    "Confirm Deletion",
                    "Are you sure you want to delete this employee?",
                    [
                        { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
                        { text: "OK", onPress: () => resolve(true) }
                    ]
                );
            });

            if (!confirmation) {
                return; // User canceled the deletion
            } 

            const response = await axios.delete(`${BASE_URL}/deleteEmployee/${params.id}`);

            if (response.status === 200) {
                Alert.alert("Success", "Employee deleted successfully.");
                router.push('/home/employeeList');
            } else {
                Alert.alert("Error", "Failed to delete employee. Please try again.");
                console.log("Failed to delete employee:", response.data.message);
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred while deleting the employee.");
            console.error("Error occurred while deleting employee data:", error);
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
                            value={dailyWage}
                            onChangeText={setDailyWage}
                            style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }}
                            placeholder='Daily Wage'
                            placeholderTextColor={"black"}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <Pressable onPress={handleUpdate} style={{ flex: 1, backgroundColor: "#2196F3", padding: 10, borderRadius: 5, alignItems: "center", marginHorizontal: 5 }}>
                            <Text style={{ fontWeight: "bold", color: "white" }}>Update</Text>
                        </Pressable>

                        <Pressable onPress={handleDelete} style={{ flex: 1, backgroundColor: "#F44336", padding: 10, borderRadius: 5, alignItems: "center", marginHorizontal: 5 }}>
                            <Text style={{ fontWeight: "bold", color: "white" }}>Delete</Text>
                        </Pressable>
                    </View>
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