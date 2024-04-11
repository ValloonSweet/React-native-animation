import { useEffect, useRef, useState } from "react";
import { View, Animated } from "react-native";


export default function Ball () {

    const ball = useRef(new Animated.ValueXY(0, 0)).current;

    useEffect(() => {
        Animated.spring(ball, {
            toValue: {x: 300, y: 500},
            useNativeDriver: false
        }).start();
    }, [])

    return (
        <Animated.View style={ball.getLayout()} >
            <View style={styles.ball} />
        </Animated.View>
    )
}


const styles = {
    ball: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 30,
        borderColor: 'black'
    }
}
