import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MemberList() {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: '',
    salary: '',
    joinDate: '',
    age: '',
  });
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editedMember, setEditedMember] = useState({});

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/members');
      setMembers(response.data.content); // Assuming the API returns a paginated response
    } catch (error) {
      console.error('There was an error fetching the members:', error);
    }
  };

  const handleNewMemberChange = (event) => {
    const { name, value } = event.target;
    setNewMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createMember = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/members', newMember);
      setMembers([...members, response.data]);
      setNewMember({ name: '', salary: '', joinDate: '', age: '' }); // Reset the form
    } catch (error) {
      console.error('There was an error creating the member:', error);
    }
  };


  const deleteMember = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/members/${id}`);
      setMembers(members.filter((member) => member.id !== id));
    } catch (error) {
      console.error('There was an error deleting the member:', error);
    }
  };

  const startEditing = (member) => {
    setEditingMemberId(member.id);
    setEditedMember({ ...member });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/members/${editingMemberId}`, editedMember);
      const updatedMembers = members.map((member) =>
        member.id === editingMemberId ? response.data : member
      );
      setMembers(updatedMembers);
      setEditingMemberId(null);
      setEditedMember({});
    } catch (error) {
      console.error('There was an error updating the member:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Members List</h2>
      <div className="mb-3">
        <input
          type="text"
          name="name"
          value={newMember.name}
          onChange={handleNewMemberChange}
          placeholder="Name"
          className="form-control"
        />
        <input
          type="number"
          name="salary"
          value={newMember.salary}
          onChange={handleNewMemberChange}
          placeholder="Salary"
          className="form-control"
        />
        <input
          type="date"
          name="joinDate"
          value={newMember.joinDate}
          onChange={handleNewMemberChange}
          className="form-control"
        />
        <input
          type="number"
          name="age"
          value={newMember.age}
          onChange={handleNewMemberChange}
          placeholder="Age"
          className="form-control"
        />
        <button className="btn btn-success" onClick={createMember}>
          Create Member
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Salary</th>
            <th>Join Date</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>
                {editingMemberId === member.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editedMember.name}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                ) : (
                  member.name
                )}
              </td>
              <td>
                {editingMemberId === member.id ? (
                  <input
                    type="number"
                    name="salary"
                    value={editedMember.salary}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                ) : (
                  `$${member.salary.toFixed(2)}`
                )}
              </td>
              <td>
                {editingMemberId === member.id ? (
                  <input
                    type="date"
                    name="joinDate"
                    value={editedMember.joinDate}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                ) : (
                  new Date(member.joinDate).toLocaleDateString()
                )}
              </td>
              <td>
                {editingMemberId === member.id ? (
                  <input
                    type="number"
                    name="age"
                    value={editedMember.age}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                ) : (
                  member.age
                )}
              </td>
              <td>
                {editingMemberId === member.id ? (
                  <div>
                    <button className="btn btn-success me-2" onClick={() => saveEdit(member.id)}>
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditingMemberId(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <button className="btn btn-primary me-2" onClick={() => startEditing(member)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => deleteMember(member.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MemberList;
