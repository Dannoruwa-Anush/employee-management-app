import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router, useRouter } from 'expo-router';

const ResultList = ({ data, newEmployee, setNewEmployee }) => {

    const router = useRouter();

    return (
        <View style={{ padding: 10 }}>
            <FlatList data={data} renderItem={({ item }) => {
                if (item?.name.toLowerCase().includes(newEmployee.toLowerCase())) {
                    return (
                        <View style={{ marginVertical: 10, gap: 10, flexDirection: "row" }}>
                            <View style={{ width: 50, height: 50, borderRadius: 8, padding: 10, backgroundColor: "#4b6cb7", alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ color: "white", fontSize: 16 }}>{item?.name?.charAt(0)}</Text>
                            </View>

                            <Pressable onPress={()=>{
                                router.push({
                                    pathname: "home/editEmployee",
                                    params: {
                                        id: item._id,
                                    },
                                });
                            }}>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item?.name}</Text>
                                    <Text style={{ marginTop: 5, color: "gray" }}>{item?.designation} ({item?.employeeNo})</Text>
                                </View>
                            </Pressable>
                        </View>
                    );
                }
            }} />
        </View>
    )
}

export default ResultList

const styles = StyleSheet.create({})