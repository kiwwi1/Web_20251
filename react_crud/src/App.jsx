import { useState, useEffect } from 'react'
import './App.css'

// BƯỚC 3: Component SearchForm - Tìm kiếm người dùng
function SearchForm({ onChangeValue }) {
  return (
    <div className="search-section">
      <input
        type="text"
        className="search-input"
        placeholder="🔍 Tìm kiếm theo tên hoặc username..."
        onChange={(e) => onChangeValue(e.target.value)}
      />
    </div>
  );
}

// BƯỚC 5: Component AddUser - Form thêm người dùng mới
function AddUser({ onAdd }) {
  const [adding, setAdding] = useState(false);
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    address: { street: "", suite: "", city: "" },
    phone: "",
    website: ""
  });

  // Xử lý thay đổi input - Nested State với Spread Operator
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (["street", "suite", "city"].includes(id)) {
      // Xử lý state lồng nhau (address)
      setUser({ ...user, address: { ...user.address, [id]: value } });
    } else {
      setUser({ ...user, [id]: value });
    }
  };

  // Thêm người dùng mới
  const handleAdd = () => {
    if (user.name === "" || user.username === "") {
      alert("⚠️ Vui lòng nhập Name và Username!");
      return;
    }
    onAdd(user);
    // Reset form
    setUser({
      name: "",
      username: "",
      email: "",
      address: { street: "", suite: "", city: "" },
      phone: "",
      website: ""
    });
    setAdding(false);
  };

  return (
    <div className="add-section">
      <button className="btn-add" onClick={() => setAdding(true)}>
        ➕ Thêm người dùng
      </button>

      {adding && (
        <div className="modal-overlay" onClick={() => setAdding(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Thêm người dùng mới</h4>
            
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                type="text"
                value={user.name}
                onChange={handleChange}
                placeholder="Nhập tên đầy đủ"
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                id="username"
                type="text"
                value={user.username}
                onChange={handleChange}
                placeholder="Nhập username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Nhập email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="text"
                value={user.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="text"
                value={user.website}
                onChange={handleChange}
                placeholder="Nhập website"
              />
            </div>

            <div className="form-group">
              <label htmlFor="street">Street</label>
              <input
                id="street"
                type="text"
                value={user.address.street}
                onChange={handleChange}
                placeholder="Nhập đường"
              />
            </div>

            <div className="form-group">
              <label htmlFor="suite">Suite</label>
              <input
                id="suite"
                type="text"
                value={user.address.suite}
                onChange={handleChange}
                placeholder="Nhập suite"
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                value={user.address.city}
                onChange={handleChange}
                placeholder="Nhập thành phố"
              />
            </div>

            <div className="modal-buttons">
              <button className="btn-save" onClick={handleAdd}>
                💾 Lưu
              </button>
              <button className="btn-cancel" onClick={() => setAdding(false)}>
                ❌ Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// BƯỚC 4, 6, 7: Component ResultTable - Hiển thị, Sửa, Xóa người dùng
function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  // BƯỚC 4: Tải dữ liệu từ API khi component mount
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  // BƯỚC 5: Thêm người dùng mới vào danh sách
  useEffect(() => {
    if (user) {
      setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }]);
      onAdded();
    }
  }, [user, onAdded]);

  // BƯỚC 4: Lọc danh sách theo keyword
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword.toLowerCase()) ||
      u.username.toLowerCase().includes(keyword.toLowerCase())
  );

  // BƯỚC 6: Sửa người dùng - Deep Copy
  function editUser(user) {
    setEditing({ ...user, address: { ...user.address } });
  }

  // BƯỚC 6: Xử lý thay đổi khi sửa
  function handleEditChange(field, value) {
    if (["street", "suite", "city"].includes(field)) {
      setEditing({ ...editing, address: { ...editing.address, [field]: value } });
    } else {
      setEditing({ ...editing, [field]: value });
    }
  }

  // BƯỚC 6: Lưu người dùng sau khi sửa
  function saveUser() {
    if (editing.name === "" || editing.username === "") {
      alert("⚠️ Vui lòng nhập Name và Username!");
      return;
    }
    setUsers(prev => prev.map(u => u.id === editing.id ? editing : u));
    setEditing(null);
  }

  // BƯỚC 7: Xóa người dùng
  function removeUser(id) {
    if (confirm("🗑️ Bạn có chắc muốn xóa người dùng này?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  }

  if (loading) {
    return <div className="loading">⏳ Đang tải dữ liệu...</div>;
  }

  return (
    <div className="table-container">
      {filteredUsers.length === 0 ? (
        <div className="no-data">
          📭 Không tìm thấy người dùng nào
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>City</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.address.city}</td>
                <td>{u.phone}</td>
                <td>{u.website}</td>
                <td>
                  <button className="btn-edit" onClick={() => editUser(u)}>
                    ✏️ Sửa
                  </button>
                  <button className="btn-delete" onClick={() => removeUser(u.id)}>
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* BƯỚC 6: Modal sửa người dùng */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Sửa thông tin người dùng</h4>
            
            <div className="form-group">
              <label htmlFor="edit-name">Name *</label>
              <input
                id="edit-name"
                type="text"
                value={editing.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-username">Username *</label>
              <input
                id="edit-username"
                type="text"
                value={editing.username}
                onChange={(e) => handleEditChange("username", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-email">Email</label>
              <input
                id="edit-email"
                type="email"
                value={editing.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-phone">Phone</label>
              <input
                id="edit-phone"
                type="text"
                value={editing.phone}
                onChange={(e) => handleEditChange("phone", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-website">Website</label>
              <input
                id="edit-website"
                type="text"
                value={editing.website}
                onChange={(e) => handleEditChange("website", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-street">Street</label>
              <input
                id="edit-street"
                type="text"
                value={editing.address.street}
                onChange={(e) => handleEditChange("street", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-suite">Suite</label>
              <input
                id="edit-suite"
                type="text"
                value={editing.address.suite}
                onChange={(e) => handleEditChange("suite", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-city">City</label>
              <input
                id="edit-city"
                type="text"
                value={editing.address.city}
                onChange={(e) => handleEditChange("city", e.target.value)}
              />
            </div>

            <div className="modal-buttons">
              <button className="btn-save" onClick={saveUser}>
                💾 Lưu thay đổi
              </button>
              <button className="btn-cancel" onClick={() => setEditing(null)}>
                ❌ Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// BƯỚC 2: Component App - Component chính quản lý state tập trung
function App() {
  const [kw, setKeyword] = useState("");
  const [newUser, setNewUser] = useState(null);

  return (
    <div className="container">
      <h1>👥 Quản lý người dùng</h1>
      <SearchForm onChangeValue={setKeyword} />
      <AddUser onAdd={setNewUser} />
      <ResultTable 
        keyword={kw} 
        user={newUser} 
        onAdded={() => setNewUser(null)} 
      />
    </div>
  );
}

export default App
