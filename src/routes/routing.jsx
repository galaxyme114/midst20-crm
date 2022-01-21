// pages
import Users from '../views/pages/users.js';
import Products from '../views/pages/products.js';
import Shippers from '../views/pages/shippers.js';
import Facilities from '../views/pages/facilities.js';
import ShipperAgents from '../views/pages/shipperAgent.js';
import Nomes from '../views/pages/nome.js';

var ThemeRoutes = [
  
  {
    path: '/users',
    name: 'Users',
    icon: 'fas fa-users',
    component: Users
  },
  { 
    path: '/products', 
    name: 'Products', 
    icon: 'fab fa-product-hunt', 
    component: Products 
  },
  { 
    path: '/shippers', 
    name: 'Shipper', 
    icon: 'fas fa-people-carry', 
    component: Shippers 
  },
  { 
    path: '/shipperagents', 
    name: 'Shipper Agents', 
    icon: 'fas fa-warehouse', 
    component: ShipperAgents 
  },
  { 
    path: '/facility', 
    name: 'Facility', 
    icon: 'fas fa-building', 
    component: Facilities 
  },
  { 
    path: '/nome', 
    name: 'Nom', 
    icon: 'fas fa-plane', 
    component: Nomes 
  },
  { path: '/', pathTo: '/users', name: 'Users', redirect: true }
];
export default ThemeRoutes;
