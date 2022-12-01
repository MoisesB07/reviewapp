import React, { Component } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
export default class CreateNote extends Component {
    state={
        users: [],
        userSelected: '',
        title: '',
        content:'',
        date: new Date(),
        editing: false,
        _id: '' 
    }
    async componentDidMount(){
        const res = await axios.get('https://reviewapp07.herokuapp.com/api/users')
        this.setState({
           users: res.data,
           userSelected: res.data[0].username
        })
        if(this.props.match.params.id){
            const res = await axios.get('https://reviewapp07.herokuapp.com/api/notes/' + this.props.match.params.id);
            this.setState({
                title: res.data.title,
                content: res.data.content,
                date: new Date(res.data.date),
                userSelected: res.data.author,
                editing: true,
               _id: this.props.match.params.id
            })
        }
    }
    onSubmit = async (e) => {
        e.preventDefault();
        const newNote ={
            title: this.state.title,
            content: this.state.content,
            date: this.state.date,
            author: this.state.userSelected
        }
        if(this.state.editing){
            await axios.put('https://reviewapp07.herokuapp.com/api/notes/' + this.state._id, newNote)
        }else{
            await axios.post('https://reviewapp07.herokuapp.com/api/notes', newNote);
        }
        window.location.href = '/';
    }
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onTitleChange = async (e) => {
        const axios = require("axios");
        const options = {
            method: 'GET',
            url: 'https://mdblist.p.rapidapi.com/',
            params: {s: e.target.value},
            headers: {
            'X-RapidAPI-Key': '68e0f963a4050aca9b0cd296a43355de',
            'X-RapidAPI-Host': 'mdblist.p.rapidapi.com'
            }
        };

        await axios.get(options).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }

    onChangeDate = date => {
        this.setState({date})
    }
    render() {
        return (
            <div className="col-md-6 offset-md-3">
                <div className="card card-body">
                    <h4>Create a Note</h4>
                    <div className="form-group">
                        <select 
                            className="form-control"
                            name="userSelected"
                            onChange={this.onInputChange}
                            value={this.state.userSelected}
                        >
                            {
                             this.state.users.map(user => 
                             <option key={user._id} value={user.username}>
                                 {user.username}
                             </option> )   
                            }
                        </select>
                    </div>
                    <form class="d-flex" role="search">
                        <input 
                            class="form-control me-2" 
                            type="search" 
                            placeholder="Buscar titulo" 
                            name="title"
                            aria-label="Search"
                            onChange={this.onTitleChange}
                            required
                            value={this.state.title}></input>
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>
                    <div className="form-group">
                        <DatePicker 
                            className="form-control" 
                            selected={this.state.date}
                            onChange={this.onChangeDate}
                        />
                    </div>
                    <form onSubmit={this.onSubmit}>
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    
}