import { Pressable, StyleSheet, Text, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import moment from 'moment';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import axios from 'axios';
import { BASE_URL } from '../../settings/config';
import { useRouter } from 'expo-router';

const editTask = () => {

    const params = useLocalSearchParams();

    //console.log(params);

    const [currentDate, setCurrentDate] = useState(moment());

    const [taskStatus, setTaskStatus] = useState("pending");

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

    const router = useRouter();

    const handleSaveTaskStatus = async () => {

        const updatedTask = {
            taskStatus: taskStatus,
        };
    
        try {
            await axios.put(`${BASE_URL}/updateTaskStatus/${params.id}`, updatedTask);
            Alert.alert("Success", "Task status updated successfully.");
            router.push('/home/taskList');
        }
        catch (error) {
            Alert.alert("The task status has not been updated successfully.");
            console.log("Error occured while updating task status", error)
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
                <View style={{ width: 80, height: 80, borderRadius: 8, padding: 10, backgroundColor: "#4b6cb7", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "white", fontSize: 16 }}>{params?.employeeName?.charAt(0)}</Text>
                </View>

                <View>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{params?.employeeName}</Text>
                    <Text style={{ marginTop: 5, color: "gray" }}>{params?.taskName}</Text>
                    <Text style={{ marginTop: 5, color: "gray" }}>{params?.designation} ({params?.employeeNo})</Text>
                </View>
            </Pressable>

            <View style={{ marginHorizontal: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: "500", letterSpacing: 3, marginTop: 7 }}>Status: </Text>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginVertical: 10 }}>
                    {/* Start - pending */}
                    <Pressable
                        onPress={() => setTaskStatus("pending")}
                        style={{
                            backgroundColor: "#C4E0E5",
                            padding: 10,
                            borderRadius: 8,
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                        }}
                    >
                        {taskStatus === "pending" ? (
                            <FontAwesome name="dot-circle-o" size={24} color="black" />
                        ) : (
                            <Entypo name="circle" size={24} color="black" />
                        )}
                        <Text style={{ marginLeft: 10 }}>Pending</Text>
                    </Pressable>
                    {/* End - pending */}


                    {/* Start - complete */}
                    <Pressable
                        onPress={() => setTaskStatus("complete")}
                        style={{
                            backgroundColor: "#C4E0E5",
                            padding: 10,
                            borderRadius: 8,
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                        }}
                    >
                        {taskStatus === "complete" ? (
                            <FontAwesome name="dot-circle-o" size={24} color="black" />
                        ) : (
                            <Entypo name="circle" size={24} color="black" />
                        )}
                        <Text style={{ marginLeft: 10 }}>Complete</Text>
                    </Pressable>
                    {/* End - complete */}
                </View>

                <Pressable onPress={handleSaveTaskStatus} style={{ backgroundColor: "#2196F3", padding: 10, marginTop: 20, justifyContent: "center", alignItems: "center", borderRadius: 5 }}>
                    <Text style={{ fontWeight: "bold", color: "white" }}>Save</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default editTask

const styles = StyleSheet.create({})