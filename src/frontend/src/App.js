import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Configurar axios para usar la URL del backend
//axios.defaults.baseURL = 'http://localhost:3000';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estados para formularios
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    matricula: '',
    carrera: ''
  });

  const [nuevoPago, setNuevoPago] = useState({
    usuario_id: '',
    concepto: '',
    monto: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [usuariosRes, pagosRes] = await Promise.all([
        axios.get('/api/usuarios'),
        axios.get('/api/pagos')
      ]);
      setUsuarios(usuariosRes.data);
      setPagos(pagosRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los datos');
    }
    setLoading(false);
  };

  // Funciones para usuarios
  const crearUsuario = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/usuarios', nuevoUsuario);
      alert(response.data.mensaje);
      setNuevoUsuario({ nombre: '', email: '', matricula: '', carrera: '' });
      cargarDatos();
    } catch (error) {
      alert(error.response?.data?.error || 'Error creando usuario');
    }
  };

  // Funciones para pagos
  const crearPago = async (e) => {
    e.preventDefault();
    try {
      const pagoData = {
        ...nuevoPago,
        monto: parseFloat(nuevoPago.monto)
      };
      const response = await axios.post('/api/pagos', pagoData);
      alert(response.data.mensaje);
      setNuevoPago({ usuario_id: '', concepto: '', monto: '' });
      cargarDatos();
    } catch (error) {
      alert(error.response?.data?.error || 'Error registrando pago');
    }
  };

  const cambiarEstadoPago = async (pagoId, nuevoEstado) => {
    try {
      await axios.put(`/api/pagos/${pagoId}/estado`, { estado: nuevoEstado });
      alert('Estado actualizado correctamente');
      cargarDatos();
    } catch (error) {
      alert('Error actualizando estado');
    }
  };

  // Componentes de la UI
  const Dashboard = () => (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Usuarios</h3>
          <p className="stat-number">{usuarios.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Pagos</h3>
          <p className="stat-number">{pagos.length}</p>
        </div>
        <div className="stat-card">
          <h3>Pagos Completados</h3>
          <p className="stat-number">
            {pagos.filter(p => p.estado === 'completado').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Pagos Pendientes</h3>
          <p className="stat-number">
            {pagos.filter(p => p.estado === 'pendiente').length}
          </p>
        </div>
      </div>
    </div>
  );

  const FormularioUsuarios = () => (
    <div className="form-section">
      <h2>📝 Registrar Nuevo Usuario</h2>
      <form onSubmit={crearUsuario} className="form">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nuevoUsuario.nombre}
          onChange={e => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="Email institucional"
          value={nuevoUsuario.email}
          onChange={e => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Matrícula"
          value={nuevoUsuario.matricula}
          onChange={e => setNuevoUsuario({...nuevoUsuario, matricula: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Carrera"
          value={nuevoUsuario.carrera}
          onChange={e => setNuevoUsuario({...nuevoUsuario, carrera: e.target.value})}
          required
        />
        <button type="submit" className="btn btn-primary">
          Registrar Usuario
        </button>
      </form>

      <div className="lista-usuarios">
        <h3>👥 Usuarios Registrados ({usuarios.length})</h3>
        <div className="card-grid">
          {usuarios.map(user => (
            <div key={user.id} className="card">
              <h4>{user.nombre}</h4>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Matrícula:</strong> {user.matricula}</p>
              <p><strong>Carrera:</strong> {user.carrera}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FormularioPagos = () => (
    <div className="form-section">
      <h2>💳 Registrar Nuevo Pago</h2>
      <form onSubmit={crearPago} className="form">
        <select
          value={nuevoPago.usuario_id}
          onChange={e => setNuevoPago({...nuevoPago, usuario_id: e.target.value})}
          required
        >
          <option value="">Seleccionar usuario</option>
          {usuarios.map(user => (
            <option key={user.id} value={user.id}>
              {user.nombre} - {user.matricula}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Concepto de pago"
          value={nuevoPago.concepto}
          onChange={e => setNuevoPago({...nuevoPago, concepto: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Monto $"
          step="0.01"
          value={nuevoPago.monto}
          onChange={e => setNuevoPago({...nuevoPago, monto: e.target.value})}
          required
        />
        <button type="submit" className="btn btn-success">
          Registrar Pago
        </button>
      </form>

      <div className="lista-pagos">
        <h3>💰 Historial de Pagos ({pagos.length})</h3>
        <div className="card-grid">
          {pagos.map(pago => (
            <div key={pago.id} className="card pago-card">
              <div className="pago-header">
                <h4>{pago.concepto}</h4>
                <span className={`estado estado-${pago.estado}`}>
                  {pago.estado}
                </span>
              </div>
              <p><strong>Estudiante:</strong> {pago.usuario_nombre}</p>
              <p><strong>Monto:</strong> ${pago.monto}</p>
              <p><strong>Referencia:</strong> {pago.referencia}</p>
              
              <div className="pago-actions">
                <button 
                  onClick={() => cambiarEstadoPago(pago.id, 'completado')}
                  className="btn btn-small btn-success"
                  disabled={pago.estado === 'completado'}
                >
                  ✅ Completar
                </button>
                <button 
                  onClick={() => cambiarEstadoPago(pago.id, 'pendiente')}
                  className="btn btn-small btn-warning"
                  disabled={pago.estado === 'pendiente'}
                >
                  ⏳ Pendiente
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="App">
      <header className="header">
        <h1>🎓 Sistema de Inscripciones y Pagos</h1>
        <p>Arquitectura Monolítica - PostgreSQL + Express + React</p>
      </header>

      <nav className="nav-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={activeTab === 'usuarios' ? 'active' : ''}
          onClick={() => setActiveTab('usuarios')}
        >
          👥 Usuarios
        </button>
        <button 
          className={activeTab === 'pagos' ? 'active' : ''}
          onClick={() => setActiveTab('pagos')}
        >
          💰 Pagos
        </button>
      </nav>

      <main className="main-content">
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'usuarios' && <FormularioUsuarios />}
            {activeTab === 'pagos' && <FormularioPagos />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;