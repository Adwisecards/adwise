import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from "react-native-modal";

const { width } = Dimensions.get('window');
const snapToInterval = width * 0.45 - 12;

const Gallery = (props) => {
    const { pictures } = props;
    const [imagePosition, setImagePosition] = useState(0);
    const [openGallery, setOpenGallery] = useState(false);

    const images = [
        {url: 'https://s3-alpha-sig.figma.com/img/eabc/e6ac/90544b81d698106f3e76eeff49fc9c4d?Expires=1604275200&Signature=JKMR3FSdjVgTq6~lAxnlbIXKV8Ut11IYAhsPh0DGWZ0AQEoeUsG0UnhxSR1g3xo8ynZ6RuvUrE9-pbjvBTLer56K9VUKKkm5KG14vdzOoyPKzu2t53NbLMUY5rlvD-U0DfYCiqdK40bomJKnmg-JpMFvy9z3exZVdMsctzakeIbX1rEEyNDxB~I0OCqtmEchvGj8TS-Y4rm5~6PBF1LDx5d8b8gvTfuZl9qLwokoqdYdkU-0t1Hb323b8W8c69O1WmiaS8hTqR3VDvtgIjPCnONft3MKz1tAJ50WslmZMP~fI~TYxNHaG35nlu9UXksZfTwEuKuSAkEIieVEMaT5Zw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'},
        {url: 'https://s3-alpha-sig.figma.com/img/eabc/e6ac/90544b81d698106f3e76eeff49fc9c4d?Expires=1604275200&Signature=JKMR3FSdjVgTq6~lAxnlbIXKV8Ut11IYAhsPh0DGWZ0AQEoeUsG0UnhxSR1g3xo8ynZ6RuvUrE9-pbjvBTLer56K9VUKKkm5KG14vdzOoyPKzu2t53NbLMUY5rlvD-U0DfYCiqdK40bomJKnmg-JpMFvy9z3exZVdMsctzakeIbX1rEEyNDxB~I0OCqtmEchvGj8TS-Y4rm5~6PBF1LDx5d8b8gvTfuZl9qLwokoqdYdkU-0t1Hb323b8W8c69O1WmiaS8hTqR3VDvtgIjPCnONft3MKz1tAJ50WslmZMP~fI~TYxNHaG35nlu9UXksZfTwEuKuSAkEIieVEMaT5Zw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'},
        {url: 'https://s3-alpha-sig.figma.com/img/eabc/e6ac/90544b81d698106f3e76eeff49fc9c4d?Expires=1604275200&Signature=JKMR3FSdjVgTq6~lAxnlbIXKV8Ut11IYAhsPh0DGWZ0AQEoeUsG0UnhxSR1g3xo8ynZ6RuvUrE9-pbjvBTLer56K9VUKKkm5KG14vdzOoyPKzu2t53NbLMUY5rlvD-U0DfYCiqdK40bomJKnmg-JpMFvy9z3exZVdMsctzakeIbX1rEEyNDxB~I0OCqtmEchvGj8TS-Y4rm5~6PBF1LDx5d8b8gvTfuZl9qLwokoqdYdkU-0t1Hb323b8W8c69O1WmiaS8hTqR3VDvtgIjPCnONft3MKz1tAJ50WslmZMP~fI~TYxNHaG35nlu9UXksZfTwEuKuSAkEIieVEMaT5Zw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'},
        {url: 'https://s3-alpha-sig.figma.com/img/eabc/e6ac/90544b81d698106f3e76eeff49fc9c4d?Expires=1604275200&Signature=JKMR3FSdjVgTq6~lAxnlbIXKV8Ut11IYAhsPh0DGWZ0AQEoeUsG0UnhxSR1g3xo8ynZ6RuvUrE9-pbjvBTLer56K9VUKKkm5KG14vdzOoyPKzu2t53NbLMUY5rlvD-U0DfYCiqdK40bomJKnmg-JpMFvy9z3exZVdMsctzakeIbX1rEEyNDxB~I0OCqtmEchvGj8TS-Y4rm5~6PBF1LDx5d8b8gvTfuZl9qLwokoqdYdkU-0t1Hb323b8W8c69O1WmiaS8hTqR3VDvtgIjPCnONft3MKz1tAJ50WslmZMP~fI~TYxNHaG35nlu9UXksZfTwEuKuSAkEIieVEMaT5Zw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'},
        {url: 'https://s3-alpha-sig.figma.com/img/eabc/e6ac/90544b81d698106f3e76eeff49fc9c4d?Expires=1604275200&Signature=JKMR3FSdjVgTq6~lAxnlbIXKV8Ut11IYAhsPh0DGWZ0AQEoeUsG0UnhxSR1g3xo8ynZ6RuvUrE9-pbjvBTLer56K9VUKKkm5KG14vdzOoyPKzu2t53NbLMUY5rlvD-U0DfYCiqdK40bomJKnmg-JpMFvy9z3exZVdMsctzakeIbX1rEEyNDxB~I0OCqtmEchvGj8TS-Y4rm5~6PBF1LDx5d8b8gvTfuZl9qLwokoqdYdkU-0t1Hb323b8W8c69O1WmiaS8hTqR3VDvtgIjPCnONft3MKz1tAJ50WslmZMP~fI~TYxNHaG35nlu9UXksZfTwEuKuSAkEIieVEMaT5Zw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'},
        {url: 'https://s3-alpha-sig.figma.com/img/eabc/e6ac/90544b81d698106f3e76eeff49fc9c4d?Expires=1604275200&Signature=JKMR3FSdjVgTq6~lAxnlbIXKV8Ut11IYAhsPh0DGWZ0AQEoeUsG0UnhxSR1g3xo8ynZ6RuvUrE9-pbjvBTLer56K9VUKKkm5KG14vdzOoyPKzu2t53NbLMUY5rlvD-U0DfYCiqdK40bomJKnmg-JpMFvy9z3exZVdMsctzakeIbX1rEEyNDxB~I0OCqtmEchvGj8TS-Y4rm5~6PBF1LDx5d8b8gvTfuZl9qLwokoqdYdkU-0t1Hb323b8W8c69O1WmiaS8hTqR3VDvtgIjPCnONft3MKz1tAJ50WslmZMP~fI~TYxNHaG35nlu9UXksZfTwEuKuSAkEIieVEMaT5Zw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'},
        {url: 'https://s3-alpha-sig.figma.com/img/eabc/e6ac/90544b81d698106f3e76eeff49fc9c4d?Expires=1604275200&Signature=JKMR3FSdjVgTq6~lAxnlbIXKV8Ut11IYAhsPh0DGWZ0AQEoeUsG0UnhxSR1g3xo8ynZ6RuvUrE9-pbjvBTLer56K9VUKKkm5KG14vdzOoyPKzu2t53NbLMUY5rlvD-U0DfYCiqdK40bomJKnmg-JpMFvy9z3exZVdMsctzakeIbX1rEEyNDxB~I0OCqtmEchvGj8TS-Y4rm5~6PBF1LDx5d8b8gvTfuZl9qLwokoqdYdkU-0t1Hb323b8W8c69O1WmiaS8hTqR3VDvtgIjPCnONft3MKz1tAJ50WslmZMP~fI~TYxNHaG35nlu9UXksZfTwEuKuSAkEIieVEMaT5Zw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'},
        {url: 'https://s3-alpha-sig.figma.com/img/eabc/e6ac/90544b81d698106f3e76eeff49fc9c4d?Expires=1604275200&Signature=JKMR3FSdjVgTq6~lAxnlbIXKV8Ut11IYAhsPh0DGWZ0AQEoeUsG0UnhxSR1g3xo8ynZ6RuvUrE9-pbjvBTLer56K9VUKKkm5KG14vdzOoyPKzu2t53NbLMUY5rlvD-U0DfYCiqdK40bomJKnmg-JpMFvy9z3exZVdMsctzakeIbX1rEEyNDxB~I0OCqtmEchvGj8TS-Y4rm5~6PBF1LDx5d8b8gvTfuZl9qLwokoqdYdkU-0t1Hb323b8W8c69O1WmiaS8hTqR3VDvtgIjPCnONft3MKz1tAJ50WslmZMP~fI~TYxNHaG35nlu9UXksZfTwEuKuSAkEIieVEMaT5Zw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'},
        {url: 'https://s3-alpha-sig.figma.com/img/eabc/e6ac/90544b81d698106f3e76eeff49fc9c4d?Expires=1604275200&Signature=JKMR3FSdjVgTq6~lAxnlbIXKV8Ut11IYAhsPh0DGWZ0AQEoeUsG0UnhxSR1g3xo8ynZ6RuvUrE9-pbjvBTLer56K9VUKKkm5KG14vdzOoyPKzu2t53NbLMUY5rlvD-U0DfYCiqdK40bomJKnmg-JpMFvy9z3exZVdMsctzakeIbX1rEEyNDxB~I0OCqtmEchvGj8TS-Y4rm5~6PBF1LDx5d8b8gvTfuZl9qLwokoqdYdkU-0t1Hb323b8W8c69O1WmiaS8hTqR3VDvtgIjPCnONft3MKz1tAJ50WslmZMP~fI~TYxNHaG35nlu9UXksZfTwEuKuSAkEIieVEMaT5Zw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'},
        {url: 'https://s3-alpha-sig.figma.com/img/eabc/e6ac/90544b81d698106f3e76eeff49fc9c4d?Expires=1604275200&Signature=JKMR3FSdjVgTq6~lAxnlbIXKV8Ut11IYAhsPh0DGWZ0AQEoeUsG0UnhxSR1g3xo8ynZ6RuvUrE9-pbjvBTLer56K9VUKKkm5KG14vdzOoyPKzu2t53NbLMUY5rlvD-U0DfYCiqdK40bomJKnmg-JpMFvy9z3exZVdMsctzakeIbX1rEEyNDxB~I0OCqtmEchvGj8TS-Y4rm5~6PBF1LDx5d8b8gvTfuZl9qLwokoqdYdkU-0t1Hb323b8W8c69O1WmiaS8hTqR3VDvtgIjPCnONft3MKz1tAJ50WslmZMP~fI~TYxNHaG35nlu9UXksZfTwEuKuSAkEIieVEMaT5Zw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'},
        {url: 'https://s3-alpha-sig.figma.com/img/eabc/e6ac/90544b81d698106f3e76eeff49fc9c4d?Expires=1604275200&Signature=JKMR3FSdjVgTq6~lAxnlbIXKV8Ut11IYAhsPh0DGWZ0AQEoeUsG0UnhxSR1g3xo8ynZ6RuvUrE9-pbjvBTLer56K9VUKKkm5KG14vdzOoyPKzu2t53NbLMUY5rlvD-U0DfYCiqdK40bomJKnmg-JpMFvy9z3exZVdMsctzakeIbX1rEEyNDxB~I0OCqtmEchvGj8TS-Y4rm5~6PBF1LDx5d8b8gvTfuZl9qLwokoqdYdkU-0t1Hb323b8W8c69O1WmiaS8hTqR3VDvtgIjPCnONft3MKz1tAJ50WslmZMP~fI~TYxNHaG35nlu9UXksZfTwEuKuSAkEIieVEMaT5Zw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'}
    ];

    const handleOpenGallery = () => {
        setOpenGallery(true)
    }

    if (pictures.length <= 0){
        return null
    }

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Фотографии <Text style={{ color: '#8152e4' }}>117</Text></Text>

            <ScrollView
                style={{ marginHorizontal: -12 }}
                contentContainerStyle={{ paddingRight: 12 }}
                snapToInterval={snapToInterval}
                bounces={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}

                decelerationRate={5}
                scrollEventThrottle={10}

                horizontal
                pagingEnabled
                disableIntervalMomentum
            >
                {
                    images.map((image, idx) => (
                        <TouchableOpacity key={'image-' + idx} style={styles.imageContainer} onPress={handleOpenGallery}>
                            <Image
                                style={{ flex: 1 }}
                                source={{ uri: image.url }}
                            />
                        </TouchableOpacity>
                    ))
                }
            </ScrollView>

            <Modal
                isVisible={openGallery}
                backdropColor={'black'}
                backdropOpacity={0.5}

                animationIn={'pulse'}
                animationOut={'pulse'}

                style={{ margin: 0, padding: 0 }}

                animationInTiming={1}
                animationOutTiming={1}

                onBackButtonPress={() => setOpenGallery(false)}
                onBackdropPress={() => setOpenGallery(false)}
            >
                <ImageViewer
                    imageUrls={images}
                    saveToLocalByLongPress={false}

                    enableSwipeDown={true}
                    onSwipeDown={() => setOpenGallery(false)}
                />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {},

    title: {
        marginBottom: 12,
        fontSize: 18,
        lineHeight: 26,
        fontFamily: 'AtypText_medium'
    },

    imageContainer: {
        width: snapToInterval - 12,
        marginLeft: 12,

        height: 110,
        borderRadius: 10,
        backgroundColor: '#C4C4C4',
        overflow: 'hidden'
    }
})

export default Gallery