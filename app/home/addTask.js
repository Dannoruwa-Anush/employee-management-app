import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';
import { BASE_URL } from '../../settings/config';

const AddTask = () => {
    const [employees, setEmployees] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState({});

    const router = useRouter();

    useEffect(() => {
        // Get all employees
        const fetchEmployeeList = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/getAllEmployees`);
                setEmployees(response.data);
            } catch (error) {
                console.log("Error occurred while fetching employees data", error);
            }
        };
        fetchEmployeeList();
    }, []);

    //console.log(selectedEmployee);

    const handleSave = () => {
        if (!taskName || !selectedEmployee) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }

        const taskData = {
            employeeNo  : selectedEmployee.employeeNo,
            employeeName: selectedEmployee.name,
            taskName,
            taskStatus: "pending", // Set to PENDING
        };

        axios.post(`${BASE_URL}/saveTask`, taskData)
            .then(() => {
                Alert.alert("The task has been saved successfully.");

                setTaskName("");
                setSelectedEmployee({});

                router.push('/home/taskList');
            })
            .catch((error) => {
                Alert.alert("The task has not been saved successfully.");
                console.error("Error occurred while saving task data", error);
            });
    };

    const employeeOptions = employees.map(employee => ({
        label: employee.name,
        value: employee,
    }));

    return (
        <ScrollView>
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 17, fontWeight: "bold" }}>Task Assignment</Text>

                <View style={{ padding: 15 }}>
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Task</Text>
                        <TextInput
                            value={taskName}
                            onChangeText={setTaskName}
                            style={{ padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5 }}
                            placeholder='Task'
                            placeholderTextColor={"black"}
                        />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Employee</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setSelectedEmployee(value)}
                            items={employeeOptions}
                            placeholder={{ label: "Select an employee", value: null }}
                            style={pickerSelectStyles}
                        />
                    </View>

                    <Pressable onPress={handleSave} style={{ backgroundColor: "#2196F3", padding: 10, marginTop: 20, justifyContent: "center", alignItems: "center", borderRadius: 5 }}>
                        <Text style={{ fontWeight: "bold", color: "white" }}>Save</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#D0D0D0', 
        borderRadius: 5,
        backgroundColor: 'white',
    },

    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 5,
        backgroundColor: 'white',
    },
});

export default AddTask;
