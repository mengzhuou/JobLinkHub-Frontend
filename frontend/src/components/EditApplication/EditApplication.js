import React, { Component } from 'react';
import { getApplicationById, updateApplication } from '../../connector';

class EditApplication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            application: null,
            loading: true,
        };
    }

    componentDidMount() {
        this.fetchApplication();
    }

    fetchApplication = async () => {
        const { appId } = this.props.match.params;
        const application = await getApplicationById(appId);
        this.setState({ application, loading: false });
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ application: { ...this.state.application, [name]: value } });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { appId } = this.props.match.params;
        await updateApplication(appId, this.state.application);
        this.props.navigate('/Profile');
    };

    render() {
        const { application, loading } = this.state;

        if (loading) return <div>Loading application...</div>;

        return (
            <form onSubmit={this.handleSubmit}>
                <label>Company:</label>
                <input
                    type="text"
                    name="company"
                    value={application.company}
                    onChange={this.handleChange}
                />
                <label>Job Title:</label>
                <input
                    type="text"
                    name="jobTitle"
                    value={application.jobTitle}
                    onChange={this.handleChange}
                />
                <label>Date Applied:</label>
                <input
                    type="date"
                    name="dateApplied"
                    value={new Date(application.dateApplied).toISOString().substring(0, 10)}
                    onChange={this.handleChange}
                />
                <button type="submit">Save Changes</button>
            </form>
        );
    }
}

export default EditApplication;
