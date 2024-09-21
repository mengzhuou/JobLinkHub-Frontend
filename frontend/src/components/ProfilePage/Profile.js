import React, { Component } from "react";
import { getApplications, deleteApplication } from '../../connector';
import { withFuncProps } from "../withFuncProps";

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applications: [],
            loading: true,
        };
    }

    componentDidMount() {
        this.fetchApplications();
    }

    fetchApplications = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const response = await getApplications(userInfo._id);
            this.setState({ applications: response, loading: false });
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    handleDelete = async (id) => {
        try {
            await deleteApplication(id);
            alert("Application deleted successfully");
            this.fetchApplications();
        } catch (error) {
            console.error("Error deleting application:", error);
        }
    };

    handleEdit = (id) => {
        this.props.navigate(`/edit-application/${id}`);
    };

    render() {
        const { applications, loading } = this.state;

        if (loading) {
            return <div>Loading applications...</div>;
        }

        return (
            <div className="profile-page">
                <h2>My Applications</h2>
                {applications.length === 0 ? (
                    <p>You haven't submitted any applications yet.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Job Title</th>
                                <th>Date Applied</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app._id}>
                                    <td>{app.company}</td>
                                    <td>{app.jobTitle}</td>
                                    <td>{new Date(app.dateApplied).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => this.handleEdit(app._id)}>Edit</button>
                                        <button onClick={() => this.handleDelete(app._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}

export default withFuncProps(ProfilePage);
