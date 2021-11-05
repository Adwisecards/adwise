import React, { PureComponent } from 'react'
import { Animated } from 'react-native'
import { View, StyleSheet, Text } from 'react-native';
import Svg, {
    Circle,
    Defs,
    LinearGradient,
    Stop
} from 'react-native-svg'
const AnimatedSvg = Animated.createAnimatedComponent(Svg)
const AnimatedCirlce = Animated.createAnimatedComponent(Circle)

export default class Splash extends PureComponent {
    constructor (props) {
        super(props)
        let size = this.props.size;
        this.textLoading = this.props.textLoading;
        this.rotateAnim = new Animated.Value(0)
        this.radius = size / 2 - 4
        this.circleCm = Math.PI * 2 * this.radius
        this.rotateArr = ['0deg', '45deg', '90deg', '135deg', '180deg', '225deg', '270deg', '315deg', '360deg']
        this.offsetArr = [this.circleCm * 0, this.circleCm * 0, this.circleCm * 0, this.circleCm * 0, this.circleCm * 0, this.circleCm * 0, this.circleCm * 0, this.circleCm * 0, this.circleCm * 0]
        this.inputRange = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    }

    componentDidMount () {
        Animated.loop(
            Animated.timing(this.rotateAnim, {
                toValue: 8,
                useNativeDriver: true,
                duration: 2000
            })
        ).start()
    }

    render () {
        const { linearGradientColor, start, end = {}, ringWidth, showBackCircle, backCircleColor, strokeLinecap, message } = this.props
        let size = this.props.size;
        const len = linearGradientColor.length
        return (
            <View style={[ styles.root, this.props.styleCustom ]}>
                <AnimatedSvg
                    viewBox={`0 0 ${size} ${size}`}
                    style={{
                        width: size,
                        height: size,
                        transform: [
                            {
                                rotate: this.rotateAnim.interpolate({
                                    inputRange: this.inputRange,
                                    outputRange: this.rotateArr
                                })
                            }
                        ]
                    }}>
                    <Defs>
                        <LinearGradient
                            id='grad'
                            x1={start.x}
                            y1={start.y}
                            x2={end.hasOwnProperty('x') ? end.x : size}
                            y2={end.hasOwnProperty('y') ? end.y : size}
                            gradientUnits='userSpaceOnUse'
                        >
                            {
                                linearGradientColor.map((item, index) =>
                                    <Stop offset={index * (index / (len - 1))} stopColor={item} key={index} />
                                )
                            }
                        </LinearGradient>
                    </Defs>
                    {
                        showBackCircle
                            ? <AnimatedCirlce
                                cx={size / 2}
                                cy={size / 2}
                                r={this.radius}
                                strokeWidth={ringWidth}
                                fill={'none'}
                                stroke={backCircleColor}
                            />
                            : null
                    }
                    <AnimatedCirlce
                        cx={size / 2}
                        cy={size / 2}
                        r={this.radius}
                        strokeWidth={ringWidth}
                        strokeDasharray={
                            [this.circleCm, this.circleCm]
                        }
                        strokeLinecap={strokeLinecap}
                        strokeDashoffset={
                            this.rotateAnim.interpolate({
                                inputRange: this.inputRange,
                                outputRange: this.offsetArr
                            })
                        }
                        fill={'none'}
                        stroke={'url(#grad)'}
                    />
                </AnimatedSvg>

                {
                    Boolean(this.textLoading) && (
                        <Text style={styles.textLoading}>{ this.textLoading }</Text>
                    )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    textLoading: {
        fontSize: 18,
        lineHeight: 26,
        textAlign: 'center',
        color: '#8152E4',

        marginTop: 14
    }
})

Splash.defaultProps = {
    size: 124,
    speed: 25,
    linearGradientColor: ['#8152E4', '#ED8E00'],
    start: { x: 0, y: 0 },
    ringWidth: 6,
    showBackCircle: true,
    backCircleColor: '#eee',
    strokeLinecap: 'round',
    direction: 0
}
