import { Pressable, StyleSheet, Text, View, ScrollView} from 'react-native'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { router, useRouter } from 'expo-router';
import { BASE_URL } from '../../settings/config';

const markAttendance = () => {

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

    //console.log(employees);

    const [attendance, setAttendance] = useState([]);

    const fetchAttendanceByDate = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/getAllAttendanceByDate`, {
                params: {
                    date: currentDate.format("MMMM D, YYYY"),
                },
            });
            setAttendance(response.data);
        } catch (error) {
            console.log("Error occured while fetching attendance by date", error);
        }
    };

    useEffect(() => {
        fetchAttendanceByDate();
    }, [currentDate]);

    const formatDailyWage = (dailyWage) => {
        return dailyWage && dailyWage.$numberDecimal ? dailyWage.$numberDecimal : "N/A";
    };

    const employeeWithAttendance = employees.map((employee) => {
        const attendanceRecord = attendance.find((record) => 
            record.employeeNo === employee.employeeNo
        );
    
        return {
            ...employee,
            status: attendanceRecord ? attendanceRecord.status : "",
            formattedDailyWage: formatDailyWage(employee.dailyWage),
        };
    });
    
    //console.log(employeeWithAttendance);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <Pressable>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginLeft: "auto", marginRight: "auto", marginVertical: 20 }}>
                    <AntDesign onPress={goToPreviousDate} name="left" size={24} color="black" />
                    <Text>{formatDate(currentDate)}</Text>

                    <AntDesign onPress={goToNextDate} name="right" size={24} color="black" />
                </View>

                <View style={{ marginHorizontal: 12 }}>
                    {employeeWithAttendance.map((item, index) => (
                        <Pressable
                            onPress={() =>
                                router.push({
                                    pathname: "home/user",
                                    params: {
                                        name: item.name,
                                        employeeNo: item.employeeNo,
                                        dailyWage: item?.formattedDailyWage,
                                        designation: item?.designation,
                                    },
                                })
                            }
                            key={index} style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 10 }}>
                            <View style={{ width: 50, height: 50, borderRadius: 8, padding: 10, backgroundColor: "#4b6cb7", alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ color: "white", fontSize: 16 }}>{item?.name?.charAt(0)}</Text>
                            </View>

                            <View style={{flex: 1}}>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item?.name}</Text>
                                <Text style={{ marginTop: 5, color: "gray" }}>{item?.designation} ({item?.employeeNo})</Text>
                            </View>

                            {item?.status && (
                                <View style={{ width: 50, height: 50, borderRadius: 8, padding: 10, backgroundColor: "#7FFFD4", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontSize: 16, color: "black", fontWeight: "bold" }}>
                                        {item.status.charAt(0)}
                                    </Text>
                                </View>
                            )}
                        </Pressable>
                    ))}
                </View>
            </Pressable>
        </ScrollView>
    )
}

export default markAttendance

const styles = StyleSheet.create({})