import React, {Component} from 'react';
import {
    Box,

    Grid,

    Typography,

    Tabs,
    Tab,

    TextField,
    InputAdornment
} from '@material-ui/core';
import {
    Search as SearchIcon
} from 'react-feather';
import {
    ProductCard,
    ProductsGrid
} from './components';
import {withStyles} from "@material-ui/styles";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import {StagesDocumentVerification} from "../../../components";

class OrganizationProducts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productCategories: '',
            searchProducts: '',

            products: []
        }

        this.organizationId = this.props.organization._id;
    }

    componentDidMount = () => {
        this.onLoadListProduct()
    }

    onLoadListProduct = () => {
        let filter = this.getFilter();
        axiosInstance.get(`${urls["get-products"]}${this.organizationId}?page=1&limit=20${ filter }`).then((response) => {
            this.setState({
                products: response.data.data.products
            })
        })
    }
    getFilter = () => {
        let filters = [];

        if(this.state.productCategories){
            filters.push('type=' + this.state.productCategories)
        };

        if (filters.length <= 0){
            return ''
        }

        return '&' + filters.join('&')
    }

    onChangeTabsCategories = (event, value) => {
        if (value !== this.state.productCategories){
            this.setState({ productCategories: value }, () => {
                this.onLoadListProduct();
            });
        }
    }

    onChangeProducts = () => {
        this.setState({ products: this.state.products })
    }

    render() {
        const {classes} = this.props;

        return (
            <Box>
                <Box mb={3}>
                    <Typography variant={'h1'}>Предложения компании</Typography>
                </Box>

                <Box mb={4}>
                    <StagesDocumentVerification/>
                </Box>

                <Box mb={4}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Tabs value={this.state.productCategories} className={classes.tabs} onChange={this.onChangeTabsCategories}>
                                <Tab value={''} label={'Всё'}/>
                                <Tab value={'goods'} label={'Товары'}/>
                                <Tab value={'service'} label={'Услуги'}/>
                            </Tabs>
                        </Grid>
                        <Grid item>
                            <TextField
                                variant={'outlined'}
                                value={this.state.searchProducts}

                                className={classes.searchInput}

                                placeholder={'Поиск'}

                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon color={'#966EEA'} width={20}/>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box>
                    <ProductsGrid
                        products={this.state.products}

                        onChangeProducts={this.onChangeProducts}
                    />
                </Box>
            </Box>
        );
    }
}

const styles = {
    searchInput: {
        '& input': {
            height: 32
        }
    },

    tabs: {
        '& .MuiTab-root': {
            minWidth: 'initial'
        }
    }
};

export default withStyles(styles)(OrganizationProducts)
