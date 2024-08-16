import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { DataTable } from 'react-native-paper';

const attendanceReport = () => {
    const [attendanceData, setAttendanceData] = useState([]);
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

    const fetchAttendanceByYearMonth = async () => {
        try {
            const response = await axios.get(`http://192.168.8.124:3000/getAllAttendanceByYearMonth`, {
                params: {
                    month: currentDate.month() + 1, // Month in MongoDB is 1-based
                    year: currentDate.year(),
                },
            });

            setAttendanceData(response.data);
        } catch (error) {
            console.log("Error occured while fetching attendance by year-month", error);
        }
    };

    useEffect(() => {
        fetchAttendanceByYearMonth();
    }, [currentDate]);

    const countAttendance = (employeeName) => {
        const filteredData = attendanceData.filter(item => item.name === employeeName);
        const presentCount = filteredData.filter(item => item.status === 'present').length;
        const absentCount = filteredData.filter(item => item.status === 'absent').length;
        return { present: presentCount, absent: absentCount };
    }

    //console.log(attendanceData);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginLeft: "auto", marginRight: "auto", marginVertical: 20 }}>
                <AntDesign onPress={goToPreviousMonth} name="left" size={24} color="black" />
                <Text>{formatDate(currentDate)}</Text>

                <AntDesign onPress={goToNextMonth} name="right" size={24} color="black" />
            </View>

            <View style={{ marginHorizontal: 12 }}>
                {attendanceData.length === 0 ? (
                    <Text style={{
                        textAlign: 'center',
                        marginVertical: 20,
                        fontSize: 16,
                        color: 'gray',
                    }}>No attendance data available</Text>
                ) : (
                    attendanceData.map((item, index) => (
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

                            <View style={{ marginTop: 15, margin: 5, padding: 5, backgroundColor: "#F0F8FF", borderRadius: 5 }}>
                                <DataTable>
                                    <DataTable.Header>
                                        <DataTable.Title>Present</DataTable.Title>
                                        <DataTable.Title>Absent</DataTable.Title>
                                    </DataTable.Header>

                                    <DataTable.Row>
                                          {/* Count the attendance status for the employee */}
                                            {(() => {
                                                const { present, absent } = countAttendance(item.name);
                                                return (
                                                    <>
                                                        <DataTable.Cell>{present}</DataTable.Cell>
                                                        <DataTable.Cell>{absent}</DataTable.Cell>
                                                    </>
                                                )
                                            })()}
                                    </DataTable.Row>
                                </DataTable>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    )
}

export default attendanceReport

const styles = StyleSheet.create({});