import { Pressable, StyleSheet, Text, View, ScrollView} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../../settings/config';

const TaskList = () => {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(moment());
    const [employees, setEmployees] = useState([]);
    const [task, setTask] = useState([]);

    const goToNextDate = () => {
        const nextDate = moment(currentDate).add(1, "days");
        setCurrentDate(nextDate);
    };

    const goToPreviousDate = () => {
        const previousDate = moment(currentDate).subtract(1, "days");
        setCurrentDate(previousDate);
    };

    const formatDate = (date) => {
        return date.format("MMMM D, YYYY");
    };

    useEffect(() => {
        const fetchEmployeeList = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/getAllEmployees`);
                setEmployees(response.data);
            } catch (error) {
                console.log("Error occurred while fetching employee data", error);
            }
        };
        fetchEmployeeList();
    }, []);

    useEffect(() => {
        const fetchTaskByDate = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/getAllTaskByDate`, {
                    params: {
                        date: currentDate.format("MMMM D, YYYY"),
                    },
                });
                setTask(response.data);
            } catch (error) {
                console.log("Error occurred while fetching task by date", error);
            }
        };
        fetchTaskByDate();
    }, [currentDate]);

    const employeeWithTask = employees.map((employee) => {
        const taskRecord = task.find((record) => record.employeeNo === employee.employeeNo);

        return {
            ...employee,
            taskId: taskRecord ? taskRecord._id : "",
            taskName: taskRecord ? taskRecord.taskName : "",
            taskStatus: taskRecord ? taskRecord.taskStatus : "",
        };
    });

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.push("/home")}>
                    <Ionicons style={styles.icon} name="arrow-back" size={24} color="black" />
                </Pressable>
                <View style={styles.dateContainer}>
                    <AntDesign onPress={goToPreviousDate} name="left" size={24} color="black" />
                    <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
                    <AntDesign onPress={goToNextDate} name="right" size={24} color="black" />
                </View>
                {employees.length > 0 && (
                    <Pressable style={styles.addButton} onPress={() => router.push("/home/addTask")}>
                        <Entypo name="add-to-list" size={24} color="black" />
                    </Pressable>
                )}
            </View>
            <View style={styles.taskList}>
                {employeeWithTask.map((item, index) => (
                    <Pressable
                        onPress={() => router.push({
                            pathname: "home/editTask",
                            params: {
                                id: item.taskId,
                                employeeNo: item.employeeNo,
                                employeeName: item.name,
                                taskName: item.taskName,
                                taskStatus: item.taskStatus,
                            },
                        })}
                        key={index} style={styles.taskItem}>
                        <View style={styles.taskIcon}>
                            <Text style={styles.taskIconText}>{item?.name?.charAt(0)}</Text>
                        </View>
                        <View style={styles.taskDetails}>
                            <Text style={styles.taskName}>{item?.name}</Text>
                            <Text style={styles.taskDescription}>{item?.taskName}</Text>
                            <Text style={styles.taskInfo}>{item?.designation} ({item?.employeeNo})</Text>
                        </View>
                        {item?.taskStatus && (
                            <View style={styles.taskStatus}>
                                <Text style={styles.taskStatusText}>
                                    {item.taskStatus.charAt(0)}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'space-between', // Added to align items within header
    },
    icon: {
        marginLeft: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        // Ensures the button is aligned to the right of the header
    },
    taskList: {
        marginHorizontal: 12,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    taskIcon: {
        width: 80,
        height: 80,
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#4b6cb7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskIconText: {
        color: 'white',
        fontSize: 16,
    },
    taskDetails: {
        flex: 1,
    },
    taskName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    taskDescription: {
        marginTop: 5,
        color: 'gray',
    },
    taskInfo: {
        marginTop: 5,
        color: 'gray',
    },
    taskStatus: {
        width: 50,
        height: 50,
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#7FFFD4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskStatusText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
});

export default TaskList;
