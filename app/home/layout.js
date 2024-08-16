import { Stack } from "expo-router"; //use to navigate between routes in an app. 

export default function Layout(){
    return(
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index"/>
            <Stack.Screen name="employeeList"/>
            <Stack.Screen name="addEmployee"/>
            <Stack.Screen name="markAttendance"/>
            <Stack.Screen name="user"/>
            <Stack.Screen name="attendanceReport"/>
            <Stack.Screen name="calculateSalary"/>
            <Stack.Screen name="editEmployee"/>
        </Stack>
    );
} 