import { useEffect, useRef, useState } from "react";
import { 
    View, Text, PanResponder, Animated, Dimensions, LayoutAnimation, UIManager
} from "react-native";
import { Card, Button } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default function Deck ({data, onSwipeLeft = () => {}, onSwipeRight = () => {}}) {
    const isFirstRender = useRef(true);
    
    let _index = 0;
    const [ index, setIndex ] = useState(0);
    const position = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gestureState) => {
                position.setValue({ x: gestureState.dx, y: gestureState.dy });
            },
            onPanResponderRelease: (e, ge) => {
                if (ge.dx > SWIPE_THRESHOLD) {
                    forceSwipe('right');
                } else if (ge.dx < -SWIPE_THRESHOLD) {
                    forceSwipe('left');
                } else {
                    resetPosition();
                }
            }
        })
    ).current;

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    });

    const resetPosition = () => {
        Animated.spring(position, {
            toValue: {x: 0, y: 0},
            useNativeDriver: false
        }).start()
    }

    const forceSwipe = (direction) => {
        const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(position, {
            useNativeDriver: false,
            toValue: {x, y: 0},
            duration: SWIPE_OUT_DURATION
        }).start(() => onSwipeComplete(direction));
    }

    const onSwipeComplete = (direction) => {
        direction === 'right' ? onSwipeRight() : onSwipeLeft();
        position.setValue({x: 0, y: 0});
        setIndex(++_index);
    }

    const renderItems = () => {
        if (index >= data.length) {
            return renderNoMoreCards();
        }

        return data.map((item, i) => {
            if (i < index) return null;
            if (i === index) {
                return (<Animated.View 
                    key={i}
                    style={[getCardStyle(), styles.cardStyle]}
                    {...panResponder.panHandlers}
                >
                    <Card>
                        <Card.Title>{item.text}</Card.Title>
                        <Card.Image source={{uri: item.uri}} />
                        <Text style={{marginBottom: 10}}>I can customize the Card further</Text>
                        <Button 
                            icon={{name: 'code'}}
                            backgroundColor="#039F4"
                            title="View Now!"
                        />
                    </Card>
                </Animated.View>)
            }

            return (
                <Animated.View 
                    key={i} 
                    style={[styles.cardStyle, {top: 10 * (i - index)}]}
                >
                    <Card>
                        <Card.Title>{item.text}</Card.Title>
                        <Card.Image source={{uri: item.uri}} />
                        <Text style={{marginBottom: 10}}>I can customize the Card further</Text>
                        <Button 
                            icon={{name: 'code'}}
                            backgroundColor="#039F4"
                            title="View Now!"
                        />
                    </Card>
                </Animated.View>
            )
        }).reverse();
    }

    const renderNoMoreCards = () => {
        return (
            <View style={styles.cardStyle}>
                <Card>
                    <Card.Title>All Done!</Card.Title>
                    <Text style={{marginBottom: 10}}>
                        There's no more content here!
                    </Text>
                    <Button
                        backgroundColor="#03A9F4"
                        title="Get more!"
                    />
                </Card>
            </View>
        )
    }

    const getCardStyle = () => {
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        })
        return {
            ...position.getLayout(),
            transform: [{rotate: rotate}]
        }
    }

    const styles = {
        cardStyle: {
            position: 'absolute',
            width: SCREEN_WIDTH,
            marginTop: 50
        }
    }

    return (
        <View 
        >
            {renderItems()}
        </View>
    )
}

