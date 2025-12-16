import React from 'react';
import { View, StyleSheet, ScrollView, Text, StatusBar } from 'react-native'; // Bỏ SafeAreaView ở đây đi
import NavigationBar from './NavigationBar';

// Giả sử bạn đã có file COLORS hoặc copy constant COLORS vào đây để demo
import { COLORS } from '../../constants/colors';

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <NavigationBar />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingTop: 110, paddingBottom: 20 }}            >
                <Text style={styles.heading}>New Release</Text>

                {[...Array(8)].map((_, i) => (
                    <View key={i} style={styles.card}>
                        <View style={styles.cardImg} />
                        <View>
                            <Text style={styles.cardTitle}>Song Title {i + 1}</Text>
                            <Text style={styles.cardSub}>Artist Name</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFF', // Màu nền trùng với thiết kế
    },
    scrollView: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
    },
    // Style cho nội dung demo
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D2E4A',
        marginBottom: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginBottom: 15,
        borderRadius: 16,
        // Shadow nhẹ
        shadowColor: '#7B6CFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardImg: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#E0E0E0',
        marginRight: 15,
    },
    cardTitle: {
        fontWeight: '600',
        fontSize: 16,
        color: '#2D2E4A',
    },
    cardSub: {
        color: '#A1A4C8',
        marginTop: 4,
    }
});

export default HomeScreen;