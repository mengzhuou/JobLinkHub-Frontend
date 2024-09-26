// import React, { Component } from "react";
// import { getRecordsByUser, updateRecord, deleteRecord } from '../../connector';

// class ProfilePage extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             records: [],
//             editRecordId: null, // Store the record being edited
//             editedRecord: {}, // Store the values of the edited record
//         };
//     }

//     componentDidMount() {
//         this.loadUserRecords();
//     }

//     loadUserRecords = async () => {
//         const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//         try {
//             const records = await getRecordsByUser(userInfo._id); // Fetch records for this user
//             this.setState({ records });
//         } catch (error) {
//             console.error("Error loading records:", error);
//         }
//     };

//     // Handle edit button click
//     handleEditClick = (record) => {
//         this.setState({ editRecordId: record._id, editedRecord: { ...record } });
//     };

//     // Handle input change when editing
//     handleInputChange = (e) => {
//         const { name, value } = e.target;
//         this.setState((prevState) => ({
//             editedRecord: {
//                 ...prevState.editedRecord,
//                 [name]: value
//             }
//         }));
//     };

//     // Save the updated record
//     handleSaveClick = async () => {
//         const { editRecordId, editedRecord } = this.state;
//         try {
//             await updateRecord(editRecordId, editedRecord);
//             this.setState({ editRecordId: null });
//             this.loadUserRecords(); // Reload the records after saving
//         } catch (error) {
//             console.error("Error updating record:", error);
//         }
//     };

//     // Handle delete record
//     handleDeleteClick = async (recordId) => {
//         try {
//             await deleteRecord(recordId);
//             this.loadUserRecords(); // Reload the records after deletion
//         } catch (error) {
//             console.error("Error deleting record:", error);
//         }
//     };

//     render() {
//         const { records, editRecordId, editedRecord } = this.state;

//         return (
//             <div>
//                 <h2>Your Uploaded Job Records</h2>
//                 {records.length === 0 ? (
//                     <p>No records found.</p>
//                 ) : (
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Company</th>
//                                 <th>Job Title</th>
//                                 <th>Date Applied</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {records.map((record) => (
//                                 <tr key={record._id}>
//                                     <td>
//                                         {editRecordId === record._id ? (
//                                             <input
//                                                 type="text"
//                                                 name="company"
//                                                 value={editedRecord.company}
//                                                 onChange={this.handleInputChange}
//                                             />
//                                         ) : (
//                                             record.company
//                                         )}
//                                     </td>
//                                     <td>
//                                         {editRecordId === record._id ? (
//                                             <input
//                                                 type="text"
//                                                 name="jobTitle"
//                                                 value={editedRecord.jobTitle}
//                                                 onChange={this.handleInputChange}
//                                             />
//                                         ) : (
//                                             record.jobTitle
//                                         )}
//                                     </td>
//                                     <td>
//                                         {editRecordId === record._id ? (
//                                             <input
//                                                 type="date"
//                                                 name="date"
//                                                 value={editedRecord.date}
//                                                 onChange={this.handleInputChange}
//                                             />
//                                         ) : (
//                                             new Date(record.date).toLocaleDateString()
//                                         )}
//                                     </td>
//                                     <td>
//                                         {editRecordId === record._id ? (
//                                             <button onClick={this.handleSaveClick}>Save</button>
//                                         ) : (
//                                             <button onClick={() => this.handleEditClick(record)}>
//                                                 Edit
//                                             </button>
//                                         )}
//                                         <button onClick={() => this.handleDeleteClick(record._id)}>
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         );
//     }
// }

// export default ProfilePage;
