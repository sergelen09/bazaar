import React, { Component } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/API";
import { Input, Card, CardTitle, Button, Icon } from 'react-materialize';
import DataPanel from "../../components/DataPanel";
import CustomCardPanel from "../../components/CardPanel";
import ItemListing from "../../components/ItemListing";
import "./Detail.css";



class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didCheckDB: 0,
      listedItems: [],
      favoriteItems: []
    };
  }

  componentDidUpdate() {
    // This Checks for User and if State has already been updated.
    if (this.props.auth && this.state.didCheckDB === 0) {
      this.loadItems(this.props.auth.email);
    }
    // This will clear state if the user logs out
    if (!this.props.auth && this.state.didCheckDB === 1) {
      this.clearState();
    }
  }

  // componentDidMount() {
  //   if (this.props.auth) {

  //     console.log('user did load');

  //   this.loadItems(this.props.auth.email);
  //   }
  // }

  loadItems = user => {
    console.log("Before Calling API");
    this.setState({ didCheckDB: 1 }, () => {
      API.getUserItems(user)
        .then(res =>
          this.setState({ listedItems: res.data })
        )
        .catch(err => console.log(err));
      API.getFavorites(user)
        .then(res =>
          this.setState({ favoriteItems: res.data })
        )
        .catch(err => console.log(err));
    })
  };

  removeListed = (event, _id) => {
    event.preventDefault();
    console.log(event);
    // // Filter this.state.friends for friends with an id not equal to the id being removed
    const listedItems = this.state.listedItems.filter(listed => listed._id !== _id);
    // // Set this.state.friends equal to the new friends array
    this.setState({ listedItems });
    API.deleteItem(_id);

  };

  returnAuth = property => {
    if (this.props.auth) {

      return <h4 style={{ color: "white" }}>Welcome {this.props.auth[property]}</h4>


    } else {
      return <h4 style={{ color: "white" }}>"You are not logged in"</h4>
    }
  }

  getData = user => {
    API.getUserItems(user)
      .then(res =>
        this.setState({ listedItems: res.data })
      ).catch(err => console.log(err));

  }

  clearState = () => {
    this.setState({
      listedItems: [],
      didCheckDB: 0
    })
  }

  render() {
    console.log(this);
    console.log("detail.js");

    return (

      <div className="container">
        {/* This function will map out the Users listings if a user is logged in */}
        <DataPanel>
          {this.returnAuth("email")}
        </DataPanel>





        <DataPanel >
          <h5 style={{ color: "white" }}> Your Listings: {this.state.listedItems.length}</h5>
          {this.state.listedItems.length > 0 &&
            <div style={{ background: "", display: "flex", flexWrap: "wrap", width: "100%", justifyContent: "space-around" }}>
              {this.state.listedItems.map(listed => (
                <ItemListing
                  removeListed={this.removeListed}
                  id={listed._id}
                  key={listed._id}
                  name={listed.itemName}
                  image={listed.image_url}
                  user={listed.userID}
                  value={listed.listed_price}
                  location={listed.location}
                />
              ))}
            </div>}
        </DataPanel>
        <DataPanel>
          <h4>Favorites</h4>
        </DataPanel>
        <DataPanel>

          {this.state.favoriteItems.length > 0 &&
            <div style={{ background: "", display: "flex", flexWrap: "wrap", width: "100%", justifyContent: "space-around" }}>
              {this.state.favoriteItems.map(listed => (
                <ItemListing
                  removeListed={this.removeListed}
                  id={listed._id}
                  key={listed._id}
                  name={listed.itemName}
                  image={listed.image_url}
                  user={listed.userID}
                  value={listed.listed_price}
                  location={listed.location}
                />
              ))}
            </div>}
        </DataPanel>
      </div>
    );
  }
}

export default Detail;
