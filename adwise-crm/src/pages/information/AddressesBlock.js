import React, { Component } from "react";
import { FormField } from "grommet";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

import { Input } from "antd";
import { Button } from "../../components/ui/UI";

import { TextInput } from "../../components/ui/UI";
import mapImage1 from "../../assets/map1.jpg";
import icons from "../../settings/icons.atlas";

import Card from "../../components/ui/Card/Card";

const { Search } = Input;

const Container = styled.div`
  margin-top: 25px;
`;
const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const SearchContainer = styled.div`
  display: flex;
`;
const CardImage = styled.img`
  display: block;
  width: 100%;
`;
const CardHeading = styled.div`
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 8px;
`;
const CardAddress = styled.div`
  color: #25233e;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.25;
`;
const CardPhoneNumber = styled.div`
  color: #9fa3b7;
  font-size: 14px;
  font-weight: 400;
`;

class AddressesBlock extends Component {
  _renderCard(card) {
    return (
      <Card header={<CardImage src={mapImage1} />}>
        <CardHeading>Филиал «Федерация»</CardHeading>
        <CardAddress>Екатеринбург, переулок Шаронова, 33</CardAddress>
        <CardPhoneNumber>тел. 8 800 260-60-40</CardPhoneNumber>
      </Card>
    );
  }

  render() {
    return (
      <Container>
        <CardsContainer>
          {this._renderCard()}
          {this._renderCard()}
          {this._renderCard()}
        </CardsContainer>
        <SearchContainer>
          <Search
            placeholder="Поиск города или района"
            allowClear
            // onSearch={onSearch}
            style={{ width: 200, margin: "0 10px" }}
          />
          <NavLink to="/information/addresses/add">
            <Button type="primary">Добавить адрес</Button>
          </NavLink>
        </SearchContainer>
      </Container>
    );
  }
}

export default AddressesBlock;
