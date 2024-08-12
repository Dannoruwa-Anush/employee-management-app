import { TouchableOpacity, Pressable, StyleSheet, Text, View, TextInput } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome6, Ionicons } from '@expo/vector-icons'; // import expo icons
import { router, useRouter } from 'expo-router';

const Index = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>

            {/* [Start - header section] */}
            <View style={styles.header}>
                <Text style={styles.appName}>Employee Management App</Text>
                <FontAwesome6 name="people-group" size={24} color="black" style={styles.appIcon} />
            </View>
            {/* [End - header section] */}


            {/* [Start - Main content section] */}
            <View style={styles.content}>
                {/* [Start - 1st row] */}
                <View style={styles.welcomeMessage}>
                    <Text style={styles.welcomeText}>Welcome to the Employee Management App!</Text>
                </View>
                {/* [Start - 1st row] */}



                {/* [Start - 2nd row] */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.buttonColumn, { marginRight: 10 }]} onPress={() =>{
                        router.push("/home/employeeList")
                    }}>
                        <Ionicons name="people" size={24} color="black" />
                        <Text style={styles.buttonText}>Employee Info</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.buttonColumn, { marginLeft: 10 }]}>
                        <AntDesign name="calendar" size={24} color="black" />
                        <Text style={styles.buttonText}>Mark Attendance</Text>
                    </TouchableOpacity>
                </View>
                {/* [End - 2nd row] */}



                {/* [Start - 3rd row] */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.buttonColumn, { marginRight: 10 }]}>
                        <AntDesign name="calculator" size={24} color="black" />
                        <Text style={styles.buttonText}>Calculate Salary</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.buttonColumn, { marginLeft: 10 }]}>
                        <Ionicons name="newspaper-outline" size={24} color="black" />
                        <Text style={styles.buttonText}>Attendance Report</Text>
                    </TouchableOpacity>
                </View>
                {/* [End - 3rd row] */}
            </View>
            {/* [End - Main content section] */}

        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    appName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    appIcon: {
        marginRight: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    welcomeMessage: {
        marginBottom: 20,
        alignItems: 'center',
        marginTop:150,
    },
    welcomeText: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
    },
    buttonColumn: {
        backgroundColor: '#4169e1',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        flex: 1, // This ensures equal width for buttons in the same row
        justifyContent: 'center', // Center the content (icon and text) vertically
        alignItems: 'center', // Center the content (icon and text) horizontally
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    content: {
        alignItems: 'center',
    },
});
