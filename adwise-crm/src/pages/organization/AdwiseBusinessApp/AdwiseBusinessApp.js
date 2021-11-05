import React, {Component} from 'react';
import {
    Box,
    Grid,
    Link,
    Typography
} from "@material-ui/core";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class AdwiseBusinessApp extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount = () => {}

    render() {
        const linkIos = "https://apps.apple.com/ru/app/adwise-business/id1541529050";
        const linkAndroid = "https://play.google.com/store/apps/details?id=cards.adwise.business";

        const qrCodeIos = `https://api.qrserver.com/v1/create-qr-code/?data=${ linkIos }&size=300x300&color=8152E4`;
        const qrCodeAndroid = `https://api.qrserver.com/v1/create-qr-code/?data=${ linkAndroid }&size=300x300&color=8152E4`;


        return (
            <>

                <Box mb={5}>
                    <Typography variant="h1">{allTranslations(localization.adwiseBusinessTitle)}</Typography>
                </Box>

                <Grid container spacing={5}>
                    <Grid item xs={4}>

                        <Box mb={3}>
                            <Typography variant="h3">{allTranslations(localization.adwiseBusinessSubtitle)}</Typography>
                        </Box>

                        <Box mb={5}>
                            <Typography dangerouslySetInnerHTML={{__html: allTranslations(localization.adwiseBusinessMessage)}}/>
                        </Box>

                        <Grid container spacing={4}>

                            <Grid item style={{ display: 'flex', flexDirection: 'column' }}>
                                <Box mb={2}>
                                    <Link href={ linkIos } target="_blank">
                                        <svg width="93" height="30" viewBox="0 0 93 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.95002 30C5.71515 30 5.48028 30 5.24541 30C4.77567 30 4.30593 30 3.75791 29.8429C3.28817 29.7644 2.81843 29.6073 2.42698 29.4503C2.03553 29.2147 1.64408 28.9791 1.33092 28.6649C1.01777 28.3508 0.704607 27.9581 0.548028 27.5654C0.313159 27.1728 0.234869 26.7801 0.156579 26.2304C0.0782897 25.6806 0 25.1309 0 24.7382C0 24.5812 0 24.0314 0 24.0314V5.89005C0 5.89005 0 5.34031 0 5.18325C0 4.79058 -1.16661e-08 4.24084 0.156579 3.6911C0.313159 3.29843 0.391448 2.82723 0.626318 2.43456C0.861187 2.04188 1.09606 1.64921 1.40921 1.33508C1.72237 1.02094 2.11382 0.78534 2.50527 0.549738C2.89672 0.314136 3.36646 0.235602 3.83619 0.157068C4.30593 3.51075e-08 4.85396 0 5.24541 0H5.95002H86.4318H87.1364C87.5279 0 88.0759 3.51075e-08 88.6239 0.157068C89.0937 0.235602 89.4851 0.39267 89.9549 0.549738C90.3463 0.78534 90.7378 1.02094 91.0509 1.33508C91.3641 1.64921 91.6772 2.04188 91.8338 2.43456C92.0687 2.82723 92.147 3.29843 92.2253 3.6911C92.3035 4.1623 92.3818 4.71204 92.3818 5.18325C92.3818 5.41885 92.3818 5.65445 92.3818 5.89005C92.3818 6.20419 92.3818 6.43979 92.3818 6.75393V23.1675C92.3818 23.4817 92.3818 23.7173 92.3818 24.0314C92.3818 24.267 92.3818 24.5026 92.3818 24.7382C92.3818 25.2094 92.3035 25.6806 92.2253 26.2304C92.147 26.7016 91.9904 27.1728 91.8338 27.5654C91.5989 27.9581 91.3641 28.3508 91.0509 28.6649C90.7378 28.9791 90.3463 29.2932 89.9549 29.4503C89.5634 29.6859 89.172 29.7644 88.6239 29.8429C88.1542 29.9215 87.6062 29.9215 87.1364 30C86.9016 30 86.6667 30 86.4318 30H85.5706H5.95002Z" fill="#000001"/>
                                            <path d="M18.789 15.2352C18.789 13.0363 20.5897 12.0153 20.668 11.9368C19.6502 10.4447 18.0844 10.2876 17.5364 10.2091C16.2055 10.052 14.9528 10.9944 14.2482 10.9944C13.5436 10.9944 12.5258 10.2091 11.4298 10.2091C10.0206 10.2091 8.68965 11.0729 7.90676 12.3295C6.41925 14.9211 7.51531 18.8478 9.00281 20.9682C9.70742 21.9892 10.5686 23.1672 11.6647 23.1672C12.7607 23.0886 13.1522 22.4604 14.4831 22.4604C15.814 22.4604 16.1272 23.1672 17.3015 23.1672C18.4759 23.1672 19.1805 22.1462 19.8851 21.0468C20.7463 19.8688 21.0594 18.6907 21.0594 18.6122C21.0594 18.6907 18.789 17.8269 18.789 15.2352Z" fill="white"/>
                                            <path d="M16.5963 8.87369C17.1444 8.16688 17.6141 7.14594 17.4575 6.125C16.5963 6.125 15.5786 6.67474 14.9523 7.46008C14.4042 8.08835 13.9345 9.10929 14.0911 10.1302C15.0306 10.1302 16.0483 9.5805 16.5963 8.87369Z" fill="white"/>
                                            <path d="M32.4904 20.5759H28.8108L27.9496 23.246H26.3838L29.9068 13.5078H31.4726L34.9957 23.246H33.4299L32.4904 20.5759ZM29.2022 19.3979H32.1772L30.6897 15.0785H30.6114L29.2022 19.3979Z" fill="white"/>
                                            <path d="M42.5892 19.7132C42.5892 21.9121 41.4148 23.3257 39.6142 23.3257C38.5964 23.3257 37.8135 22.8545 37.4221 22.0692V25.6032H35.9346V16.1791H37.3438V17.3572C37.7352 16.5718 38.5964 16.1006 39.6142 16.1006C41.3366 16.0221 42.5892 17.5142 42.5892 19.7132ZM41.0234 19.7132C41.0234 18.2996 40.3188 17.3572 39.1444 17.3572C38.0484 17.3572 37.2655 18.2996 37.2655 19.7132C37.2655 21.1268 38.0484 22.0692 39.1444 22.0692C40.3188 22.0692 41.0234 21.1268 41.0234 19.7132Z" fill="white"/>
                                            <path d="M50.3402 19.7132C50.3402 21.9121 49.1658 23.3257 47.3652 23.3257C46.3474 23.3257 45.5645 22.8545 45.1731 22.0692V25.6032H43.6855V16.1791H45.0948V17.3572C45.4862 16.5718 46.3474 16.1006 47.3652 16.1006C49.1658 16.0221 50.3402 17.5142 50.3402 19.7132ZM48.8527 19.7132C48.8527 18.2996 48.1481 17.3572 46.9737 17.3572C45.8777 17.3572 45.0948 18.2996 45.0948 19.7132C45.0948 21.1268 45.8777 22.0692 46.9737 22.0692C48.1481 22.0692 48.8527 21.1268 48.8527 19.7132Z" fill="white"/>
                                            <path d="M55.5076 20.4982C55.5858 21.4406 56.5253 22.0688 57.8562 22.0688C59.1089 22.0688 59.9701 21.4406 59.9701 20.5767C59.9701 19.7914 59.422 19.3987 58.1694 19.0845L56.9168 18.7704C55.1161 18.2992 54.3332 17.5139 54.3332 16.1788C54.3332 14.5296 55.8207 13.3516 57.8562 13.3516C59.8918 13.3516 61.301 14.5296 61.3793 16.1788H59.8918C59.8135 15.2364 59.0306 14.6081 57.8562 14.6081C56.6819 14.6081 55.899 15.2364 55.899 16.1003C55.899 16.8071 56.447 17.1997 57.6997 17.5139L58.7957 17.7495C60.753 18.2207 61.6142 19.006 61.6142 20.4196C61.6142 22.2259 60.1266 23.4039 57.8562 23.4039C55.6641 23.4039 54.2549 22.3044 54.1766 20.4982H55.5076Z" fill="white"/>
                                            <path d="M64.5891 14.4492V16.0984H65.92V17.2764H64.5891V21.2031C64.5891 21.8314 64.824 22.067 65.4503 22.067C65.6069 22.067 65.8417 22.067 65.92 22.067V23.245C65.7634 23.3236 65.4503 23.3236 65.1371 23.3236C63.7279 23.3236 63.1799 22.7738 63.1799 21.4387V17.355H62.1621V16.177H63.1799V14.5278H64.5891V14.4492Z" fill="white"/>
                                            <path d="M66.7812 19.7141C66.7812 17.5152 68.1122 16.1016 70.1477 16.1016C72.1832 16.1016 73.5142 17.5152 73.5142 19.7141C73.5142 21.9916 72.1832 23.3267 70.1477 23.3267C68.0339 23.3267 66.7812 21.9131 66.7812 19.7141ZM72.0267 19.7141C72.0267 18.1434 71.3221 17.2796 70.1477 17.2796C68.9734 17.2796 68.2688 18.1434 68.2688 19.7141C68.2688 21.2848 68.9734 22.1487 70.1477 22.1487C71.3221 22.1487 72.0267 21.2063 72.0267 19.7141Z" fill="white"/>
                                            <path d="M74.6885 16.1016H76.0977V17.3581C76.3326 16.5728 76.9589 16.1016 77.8201 16.1016C78.0549 16.1016 78.2115 16.1016 78.2898 16.1801V17.5152C78.2115 17.4366 77.8984 17.4366 77.6635 17.4366C76.724 17.4366 76.176 18.0649 76.176 19.0859V23.3267H74.6885V16.1016Z" fill="white"/>
                                            <path d="M85.0233 21.1281C84.7884 22.3847 83.5358 23.3271 81.97 23.3271C79.9344 23.3271 78.6035 21.9135 78.6035 19.7145C78.6035 17.5156 79.8562 16.0234 81.8917 16.0234C83.8489 16.0234 85.1016 17.3585 85.1016 19.5575V20.0287H80.091V20.1072C80.091 21.2852 80.8739 22.1491 81.97 22.1491C82.7529 22.1491 83.3792 21.7564 83.6141 21.1281H85.0233ZM80.091 19.0077H83.6141C83.6141 17.9083 82.9095 17.2014 81.8917 17.2014C80.8739 17.2014 80.1693 17.9868 80.091 19.0077Z" fill="white"/>
                                            <path d="M28.1058 8.16729H28.7321C29.2802 8.16729 29.5933 7.85316 29.5933 7.38195C29.5933 6.91075 29.2802 6.67515 28.7321 6.67515C28.1841 6.67515 27.7927 6.98928 27.7927 7.38195H27.0881C27.1663 6.51808 27.7927 6.04688 28.7321 6.04688C29.6716 6.04688 30.2979 6.59661 30.2979 7.30342C30.2979 7.85316 29.9848 8.24583 29.4367 8.4029V8.48143C30.0631 8.55996 30.4545 8.95263 30.4545 9.58091C30.4545 10.3662 29.6716 10.9945 28.7321 10.9945C27.7144 10.9945 27.0098 10.4448 27.0098 9.58091H27.7144C27.7927 10.0521 28.1841 10.2877 28.8104 10.2877C29.4367 10.2877 29.8282 9.97358 29.8282 9.50237C29.8282 9.03117 29.4367 8.71703 28.8104 8.71703H28.1841V8.16729H28.1058Z" fill="white"/>
                                            <path d="M31.3164 9.81819C31.3164 9.18991 31.7861 8.79724 32.6473 8.79724L33.5868 8.71871V8.40457C33.5868 8.0119 33.3519 7.85483 32.8822 7.85483C32.4908 7.85483 32.2559 8.0119 32.1776 8.2475H31.473C31.5513 7.61923 32.0993 7.22656 32.8822 7.22656C33.7434 7.22656 34.2914 7.69777 34.2914 8.40457V10.8391H33.5868V10.3679H33.5085C33.2736 10.7606 32.8822 10.9177 32.4125 10.9177C31.8644 10.9177 31.3164 10.4465 31.3164 9.81819ZM33.5868 9.50405V9.18991L32.7256 9.26845C32.2559 9.26845 32.021 9.50405 32.021 9.73965C32.021 10.0538 32.3342 10.2109 32.6473 10.2109C33.1954 10.2894 33.5868 9.97525 33.5868 9.50405Z" fill="white"/>
                                            <path d="M36.1704 7.85443V10.8387H35.4658V7.30469H37.8145V7.85443H36.1704Z" fill="white"/>
                                            <path d="M41.9641 9.03325C41.9641 10.1327 41.4161 10.8395 40.4766 10.8395C40.0069 10.8395 39.5371 10.6039 39.3806 10.2113H39.3023V11.939H38.5977V7.22697H39.3023V7.77671H39.3806C39.6154 7.38404 40.0069 7.14844 40.4766 7.14844C41.4161 7.22697 41.9641 7.93378 41.9641 9.03325ZM41.2595 9.03325C41.2595 8.24791 40.8681 7.85524 40.32 7.85524C39.772 7.85524 39.3806 8.32645 39.3806 9.03325C39.3806 9.74006 39.772 10.2113 40.32 10.2113C40.9463 10.2898 41.2595 9.81859 41.2595 9.03325Z" fill="white"/>
                                            <path d="M42.903 12.0953V11.467C42.9813 11.467 43.0596 11.467 43.1379 11.467C43.451 11.467 43.6859 11.3099 43.7642 10.9958L43.8425 10.8387L42.5898 7.30469H43.3727L44.2339 10.1319H44.3122L45.1734 7.30469H45.878L44.5471 10.9958C44.2339 11.8597 43.9208 12.0953 43.2162 12.0953C43.1379 12.0953 42.9813 12.0953 42.903 12.0953Z" fill="white"/>
                                            <path d="M46.4258 9.81819H47.1304C47.2087 10.1323 47.5218 10.2894 47.9133 10.2894C48.383 10.2894 48.6962 10.0538 48.6962 9.73965C48.6962 9.42552 48.4613 9.26845 47.9133 9.26845H47.3653V8.71871H47.9133C48.3047 8.71871 48.5396 8.56164 48.5396 8.2475C48.5396 8.0119 48.3047 7.7763 47.9133 7.7763C47.5218 7.7763 47.2087 7.93337 47.2087 8.2475H46.5041C46.5824 7.61923 47.1304 7.22656 47.9133 7.22656C48.7745 7.22656 49.2442 7.61923 49.2442 8.16897C49.2442 8.56164 49.0093 8.79724 48.6962 8.87578V8.95431C49.1659 9.03285 49.4008 9.34698 49.4008 9.73965C49.4008 10.4465 48.8528 10.8391 47.9916 10.8391C47.1304 10.9177 46.5041 10.525 46.4258 9.81819Z" fill="white"/>
                                            <path d="M50.3398 10.8387V7.30469H51.0445V9.73924L52.6885 7.30469H53.3931V10.8387H52.6885V8.40416H52.6102L50.9662 10.8387H50.3398Z" fill="white"/>
                                            <path d="M57.1526 7.85443H56.0565V10.8387H55.3519V7.85443H54.2559V7.30469H57.1526V7.85443Z" fill="white"/>
                                            <path d="M60.911 9.89672C60.7545 10.525 60.2064 10.9177 59.3453 10.9177C58.3275 10.9177 57.7012 10.2109 57.7012 9.11138C57.7012 8.0119 58.3275 7.22656 59.3453 7.22656C60.363 7.22656 60.911 7.93337 60.911 9.03284V9.26845H58.4058C58.4058 9.89672 58.7972 10.2894 59.3453 10.2894C59.7367 10.2894 60.0499 10.1323 60.2064 9.89672H60.911ZM58.4841 8.71871H60.2847C60.2847 8.16897 59.8933 7.7763 59.4235 7.7763C58.8755 7.85483 58.4841 8.16897 58.4841 8.71871Z" fill="white"/>
                                            <path d="M63.8849 7.30469H65.4507C66.1553 7.30469 66.5468 7.61882 66.5468 8.16856C66.5468 8.56123 66.3119 8.87537 65.9205 8.9539V9.03244C66.3902 9.11097 66.7034 9.42511 66.7034 9.81778C66.7034 10.446 66.2336 10.8387 65.4507 10.8387H63.8066V7.30469H63.8849ZM64.5895 7.85443V8.7183H65.2941C65.6856 8.7183 65.9205 8.56123 65.9205 8.2471C65.9205 7.93296 65.7639 7.77589 65.3724 7.77589H64.5895V7.85443ZM64.5895 9.26804V10.289H65.4507C65.8422 10.289 66.077 10.1319 66.077 9.73924C66.077 9.34657 65.8422 9.1895 65.3724 9.1895H64.5895V9.26804Z" fill="white"/>
                                        </svg>
                                    </Link>
                                </Box>


                                <img
                                    style={{ margin: '0 auto' }}

                                    src={ qrCodeIos }
                                    width={80}
                                    height={80}
                                />
                            </Grid>

                            <Grid item style={{ display: 'flex', flexDirection: 'column' }}>
                                <Box mb={2}>
                                    <Link href={ linkAndroid } target="_blank">
                                        <svg width="102" height="30" viewBox="0 0 102 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M97.5 30H3.75C1.65 30 0 28.275 0 26.25V3.75C0 1.65 1.725 0 3.75 0H97.5C99.6 0 101.25 1.725 101.25 3.75V26.25C101.25 28.275 99.6 30 97.5 30Z" fill="black"/>
                                            <path d="M35.5488 7.65078C35.5488 8.25078 35.3988 8.77578 35.0238 9.15078C34.5738 9.60078 34.0488 9.82578 33.3738 9.82578C32.6988 9.82578 32.1738 9.60078 31.7238 9.15078C31.2738 8.70078 31.0488 8.17578 31.0488 7.50078C31.0488 6.82578 31.2738 6.30078 31.7238 5.85078C32.1738 5.40078 32.6988 5.17578 33.3738 5.17578C33.6738 5.17578 33.9738 5.25078 34.2738 5.40078C34.5738 5.55078 34.7988 5.70078 34.9488 5.92578L34.5738 6.30078C34.2738 5.92578 33.8988 5.77578 33.3738 5.77578C32.9238 5.77578 32.4738 5.92578 32.1738 6.30078C31.7988 6.60078 31.6488 7.05078 31.6488 7.57578C31.6488 8.10078 31.7988 8.55078 32.1738 8.85078C32.5488 9.15078 32.9238 9.37578 33.3738 9.37578C33.8988 9.37578 34.2738 9.22578 34.6488 8.85078C34.8738 8.62578 35.0238 8.32578 35.0238 7.95078H33.3738V7.42578H35.5488C35.5488 7.42578 35.5488 7.57578 35.5488 7.65078Z" fill="white" stroke="white" stroke-width="0.154676" stroke-miterlimit="10"/>
                                            <path d="M39 5.775H36.975V7.2H38.85V7.725H36.975V9.15H39V9.75H36.375V5.25H39V5.775Z" fill="white" stroke="white" stroke-width="0.154676" stroke-miterlimit="10"/>
                                            <path d="M41.4756 9.75H40.8756V5.775H39.6006V5.25H42.7506V5.775H41.4756V9.75Z" fill="white" stroke="white" stroke-width="0.154676" stroke-miterlimit="10"/>
                                            <path d="M44.9248 9.75V5.25H45.5248V9.75H44.9248Z" fill="white" stroke="white" stroke-width="0.154676" stroke-miterlimit="10"/>
                                            <path d="M48.0752 9.75H47.4752V5.775H46.2002V5.25H49.2752V5.775H48.0002V9.75H48.0752Z" fill="white" stroke="white" stroke-width="0.154676" stroke-miterlimit="10"/>
                                            <path d="M55.1999 9.15078C54.7499 9.60078 54.2249 9.82578 53.5499 9.82578C52.8749 9.82578 52.3498 9.60078 51.8998 9.15078C51.4498 8.70078 51.2249 8.17578 51.2249 7.50078C51.2249 6.82578 51.4498 6.30078 51.8998 5.85078C52.3498 5.40078 52.8749 5.17578 53.5499 5.17578C54.2249 5.17578 54.7499 5.40078 55.1999 5.85078C55.6498 6.30078 55.8749 6.82578 55.8749 7.50078C55.8749 8.17578 55.6498 8.70078 55.1999 9.15078ZM52.3499 8.77578C52.6499 9.07578 53.0999 9.30078 53.5499 9.30078C53.9999 9.30078 54.4499 9.15078 54.7499 8.77578C55.0499 8.47578 55.2748 8.02578 55.2748 7.50078C55.2748 6.97578 55.1249 6.52578 54.7499 6.22578C54.4499 5.92578 53.9999 5.70078 53.5499 5.70078C53.0999 5.70078 52.6499 5.85078 52.3499 6.22578C52.0499 6.52578 51.8249 6.97578 51.8249 7.50078C51.8249 8.02578 51.9749 8.47578 52.3499 8.77578Z" fill="white" stroke="white" stroke-width="0.154676" stroke-miterlimit="10"/>
                                            <path d="M56.7002 9.75V5.25H57.3752L59.5502 8.775V7.875V5.25H60.1502V9.75H59.5502L57.2252 6.075V6.975V9.75H56.7002Z" fill="white" stroke="white" stroke-width="0.154676" stroke-miterlimit="10"/>
                                            <path d="M51.0742 16.3492C49.2742 16.3492 47.8492 17.6992 47.8492 19.5742C47.8492 21.3742 49.2742 22.7992 51.0742 22.7992C52.8742 22.7992 54.2992 21.4492 54.2992 19.5742C54.2992 17.6242 52.8742 16.3492 51.0742 16.3492ZM51.0742 21.4492C50.0992 21.4492 49.2742 20.6242 49.2742 19.4992C49.2742 18.3742 50.0992 17.5492 51.0742 17.5492C52.0492 17.5492 52.8742 18.2992 52.8742 19.4992C52.8742 20.6242 52.0492 21.4492 51.0742 21.4492ZM44.0992 16.3492C42.2992 16.3492 40.8742 17.6992 40.8742 19.5742C40.8742 21.3742 42.2992 22.7992 44.0992 22.7992C45.8992 22.7992 47.3242 21.4492 47.3242 19.5742C47.3242 17.6242 45.8992 16.3492 44.0992 16.3492ZM44.0992 21.4492C43.1242 21.4492 42.2992 20.6242 42.2992 19.4992C42.2992 18.3742 43.1242 17.5492 44.0992 17.5492C45.0742 17.5492 45.8992 18.2992 45.8992 19.4992C45.8992 20.6242 45.0742 21.4492 44.0992 21.4492ZM35.7742 17.3242V18.6742H38.9992C38.9242 19.4242 38.6242 20.0242 38.2492 20.3992C37.7992 20.8492 37.0492 21.3742 35.7742 21.3742C33.7492 21.3742 32.2492 19.7992 32.2492 17.7742C32.2492 15.7492 33.8242 14.1742 35.7742 14.1742C36.8242 14.1742 37.6492 14.6242 38.2492 15.1492L39.2242 14.1742C38.3992 13.4242 37.3492 12.8242 35.8492 12.8242C33.1492 12.8242 30.8242 15.0742 30.8242 17.7742C30.8242 20.4742 33.1492 22.7242 35.8492 22.7242C37.3492 22.7242 38.3992 22.2742 39.2992 21.2992C40.1992 20.3992 40.4992 19.1242 40.4992 18.1492C40.4992 17.8492 40.4992 17.5492 40.4242 17.3242H35.7742ZM69.8242 18.3742C69.5242 17.6242 68.7742 16.3492 67.1242 16.3492C65.4742 16.3492 64.1242 17.6242 64.1242 19.5742C64.1242 21.3742 65.4742 22.7992 67.2742 22.7992C68.6992 22.7992 69.5992 21.8992 69.8992 21.3742L68.8492 20.6242C68.4742 21.1492 68.0242 21.5242 67.2742 21.5242C66.5242 21.5242 66.0742 21.2242 65.6992 20.5492L69.9742 18.7492L69.8242 18.3742ZM65.4742 19.4242C65.4742 18.2242 66.4492 17.5492 67.1242 17.5492C67.6492 17.5492 68.1742 17.8492 68.3242 18.2242L65.4742 19.4242ZM61.9492 22.4992H63.3742V13.1242H61.9492V22.4992ZM59.6992 17.0242C59.3242 16.6492 58.7242 16.2742 57.9742 16.2742C56.3992 16.2742 54.8992 17.6992 54.8992 19.4992C54.8992 21.2992 56.3242 22.6492 57.9742 22.6492C58.7242 22.6492 59.3242 22.2742 59.6242 21.8992H59.6992V22.3492C59.6992 23.5492 59.0242 24.2242 57.9742 24.2242C57.1492 24.2242 56.5492 23.6242 56.3992 23.0992L55.1992 23.6242C55.5742 24.4492 56.4742 25.4992 58.0492 25.4992C59.6992 25.4992 61.0492 24.5242 61.0492 22.1992V16.4992H59.6992V17.0242ZM58.0492 21.4492C57.0742 21.4492 56.2492 20.6242 56.2492 19.4992C56.2492 18.3742 57.0742 17.5492 58.0492 17.5492C59.0242 17.5492 59.7742 18.3742 59.7742 19.4992C59.7742 20.6242 59.0242 21.4492 58.0492 21.4492ZM76.3492 13.1242H72.9742V22.4992H74.3992V18.9742H76.3492C77.9242 18.9742 79.4242 17.8492 79.4242 16.0492C79.4242 14.2492 77.9242 13.1242 76.3492 13.1242ZM76.4242 17.6242H74.3992V14.3992H76.4242C77.4742 14.3992 78.0742 15.2992 78.0742 15.9742C77.9992 16.7992 77.3992 17.6242 76.4242 17.6242ZM85.0492 16.2742C83.9992 16.2742 82.9492 16.7242 82.5742 17.6992L83.8492 18.2242C84.1492 17.6992 84.5992 17.5492 85.1242 17.5492C85.8742 17.5492 86.5492 17.9992 86.6242 18.7492V18.8242C86.3992 18.6742 85.7992 18.4492 85.1992 18.4492C83.8492 18.4492 82.4992 19.1992 82.4992 20.5492C82.4992 21.8242 83.6242 22.6492 84.8242 22.6492C85.7992 22.6492 86.2492 22.1992 86.6242 21.7492H86.6992V22.4992H88.0492V18.8992C87.8992 17.2492 86.6242 16.2742 85.0492 16.2742ZM84.8992 21.4492C84.4492 21.4492 83.7742 21.2242 83.7742 20.6242C83.7742 19.8742 84.5992 19.6492 85.2742 19.6492C85.8742 19.6492 86.1742 19.7992 86.5492 19.9492C86.3992 20.8492 85.6492 21.4492 84.8992 21.4492ZM92.7742 16.4992L91.1992 20.5492H91.1242L89.4742 16.4992H87.9742L90.4492 22.1992L89.0242 25.3492H90.4492L94.2742 16.4992H92.7742ZM80.1742 22.4992H81.5992V13.1242H80.1742V22.4992Z" fill="white"/>
                                            <path d="M7.7998 5.625C7.5748 5.85 7.4248 6.225 7.4248 6.675V23.25C7.4248 23.7 7.5748 24.075 7.7998 24.3L7.8748 24.375L17.1748 15.075V15V14.925L7.7998 5.625Z" fill="url(#paint0_linear)"/>
                                            <path d="M20.2488 18.2227L17.1738 15.1477V14.9977V14.9227L20.2488 11.8477L20.3238 11.9227L23.9988 14.0227C25.0488 14.6227 25.0488 15.5977 23.9988 16.1977L20.2488 18.2227Z" fill="url(#paint1_linear)"/>
                                            <path d="M20.3248 18.15L17.1748 15L7.7998 24.375C8.1748 24.75 8.69981 24.75 9.3748 24.45L20.3248 18.15Z" fill="url(#paint2_linear)"/>
                                            <path d="M20.3252 11.8504L9.37517 5.62545C8.70017 5.25045 8.17517 5.32545 7.80017 5.70045L17.1752 15.0004L20.3252 11.8504Z" fill="url(#paint3_linear)"/>
                                            <path opacity="0.2" d="M20.2504 18.0742L9.37542 24.2242C8.77542 24.5992 8.25042 24.5242 7.87542 24.2242L7.80042 24.2992L7.87542 24.3742C8.25042 24.6742 8.77542 24.7492 9.37542 24.3742L20.2504 18.0742Z" fill="black"/>
                                            <path opacity="0.12" d="M7.8 24.2258C7.575 24.0008 7.5 23.6258 7.5 23.1758V23.2508C7.5 23.7008 7.65 24.0758 7.875 24.3008V24.2258H7.8Z" fill="black"/>
                                            <path opacity="0.12" d="M24 15.975L20.25 18.075L20.325 18.15L24 16.05C24.525 15.75 24.75 15.375 24.75 15C24.75 15.375 24.45 15.675 24 15.975Z" fill="black"/>
                                            <path opacity="0.25" d="M9.37463 5.6993L23.9996 14.0243C24.4496 14.3243 24.7496 14.6243 24.7496 14.9993C24.7496 14.6243 24.5246 14.2493 23.9996 13.9493L9.37463 5.6243C8.32463 5.0243 7.49963 5.5493 7.49963 6.7493V6.8243C7.49963 5.6243 8.32463 5.0993 9.37463 5.6993Z" fill="white"/>
                                            <defs>
                                                <linearGradient id="paint0_linear" x1="16.3496" y1="6.53227" x2="3.76278" y2="19.1191" gradientUnits="userSpaceOnUse">
                                                    <stop stop-color="#00A0FF"/>
                                                    <stop offset="0.00657445" stop-color="#00A1FF"/>
                                                    <stop offset="0.2601" stop-color="#00BEFF"/>
                                                    <stop offset="0.5122" stop-color="#00D2FF"/>
                                                    <stop offset="0.7604" stop-color="#00DFFF"/>
                                                    <stop offset="1" stop-color="#00E3FF"/>
                                                </linearGradient>
                                                <linearGradient id="paint1_linear" x1="25.3746" y1="14.9987" x2="7.22695" y2="14.9987" gradientUnits="userSpaceOnUse">
                                                    <stop stop-color="#FFE000"/>
                                                    <stop offset="0.4087" stop-color="#FFBD00"/>
                                                    <stop offset="0.7754" stop-color="#FFA500"/>
                                                    <stop offset="1" stop-color="#FF9C00"/>
                                                </linearGradient>
                                                <linearGradient id="paint2_linear" x1="18.6201" y1="16.7221" x2="1.55133" y2="33.7908" gradientUnits="userSpaceOnUse">
                                                    <stop stop-color="#FF3A44"/>
                                                    <stop offset="1" stop-color="#C31162"/>
                                                </linearGradient>
                                                <linearGradient id="paint3_linear" x1="5.47315" y1="0.132601" x2="13.0951" y2="7.75447" gradientUnits="userSpaceOnUse">
                                                    <stop stop-color="#32A071"/>
                                                    <stop offset="0.0685" stop-color="#2DA771"/>
                                                    <stop offset="0.4762" stop-color="#15CF74"/>
                                                    <stop offset="0.8009" stop-color="#06E775"/>
                                                    <stop offset="1" stop-color="#00F076"/>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </Link>
                                </Box>

                                <img
                                    style={{ margin: '0 auto' }}

                                    src={ qrCodeAndroid }
                                    width={80}
                                    height={80}
                                />
                            </Grid>

                        </Grid>

                    </Grid>
                    <Grid item xs={8}>
                        <img src="/source/images/adwise_business_app/phones_app.png"/>
                    </Grid>
                </Grid>

            </>
        );
    }
}

export default AdwiseBusinessApp
