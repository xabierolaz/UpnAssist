import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

import { applications, appCategories, getApplicationsByCategory } from '../data/applications';
import type { Application, AppCategory } from '../types/applications';

const ApplicationLauncher: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAppClick = (app: Application) => {
    if (app.action) {
      app.action();
    } else if (app.route) {
      navigate(app.route);
    }
  };  const getStatusBadge = (app: Application) => {
    if (!app.isActive) {
      return (
        <span className="absolute -top-1 -right-1 bg-yellow-500 text-white px-1 py-0.5 rounded-full text-xs leading-none">
          Soon
        </span>
      );
    }
    if (app.badge) {
      return (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white px-1 py-0.5 rounded-full min-w-[16px] text-center text-xs leading-none">
          {app.badge}
        </span>
      );
    }
    return null;
  };  const AppCard: React.FC<{ app: Application }> = ({ app }) => {
    const IconComponent = app.icon;
    
    return (
      <div
        onClick={() => handleAppClick(app)}
        className={`relative p-3 rounded-lg border transition-all duration-200 cursor-pointer min-h-[100px] ${
          app.isActive 
            ? 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white' 
            : 'border-gray-100 bg-gray-50 opacity-75 hover:opacity-100'
        }`}
      >
        {getStatusBadge(app)}
        
        <div className="flex flex-col items-center text-center h-full justify-between">
          <div className={`w-12 h-12 rounded-lg ${app.color} flex items-center justify-center mb-2`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-gray-900 mb-1 leading-tight line-clamp-2">
              {app.name}
            </h3>
            
            <p className="text-xs text-gray-500 line-clamp-2 leading-tight">
              {app.description}
            </p>
          </div>
          
          <div className="mt-2 flex items-center justify-center">
            <span className={`inline-block w-2 h-2 rounded-full ${app.isActive ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
          </div>
        </div>
      </div>
    );
  };

  const AppListItem: React.FC<{ app: Application }> = ({ app }) => {
    const IconComponent = app.icon;
    
    return (
      <div
        onClick={() => handleAppClick(app)}
        className={`relative flex items-center p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
          app.isActive 
            ? 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white' 
            : 'border-gray-100 bg-gray-50 opacity-75 hover:opacity-100'
        }`}
      >
        {getStatusBadge(app)}
        
        <div className={`w-12 h-12 rounded-lg ${app.color} flex items-center justify-center mr-4`}>
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">
            {app.name}
          </h3>
          <p className="text-sm text-gray-600">
            {app.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <span className={`inline-block w-2 h-2 rounded-full ${app.isActive ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
          <span className="text-xs text-gray-500">
            {app.isActive ? 'Disponible' : 'En desarrollo'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Aplicaciones UpnAssist</h1>
        <p className="mt-2 text-gray-600">
          Portal completo de herramientas académicas para profesores
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar aplicaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-4">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as AppCategory | 'all')}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              {Object.values(appCategories).map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <FunnelIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Squares2X2Icon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ListBulletIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.values(appCategories).map(category => {
          const appsInCategory = getApplicationsByCategory(category.id);
          const activeApps = appsInCategory.filter(app => app.isActive).length;
          const IconComponent = category.icon;
          
          return (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedCategory === category.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {activeApps}/{appsInCategory.length} apps
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Applications Grid/List */}
      <div>
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron aplicaciones</p>
          </div>
        ) : (
          <>            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredApplications.map(app => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApplications.map(app => (
                  <AppListItem key={app.id} app={app} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {applications.filter(app => app.isActive).length}
            </p>
            <p className="text-sm text-gray-600">Aplicaciones Activas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">
              {applications.filter(app => !app.isActive).length}
            </p>
            <p className="text-sm text-gray-600">En Desarrollo</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {Object.keys(appCategories).length}
            </p>
            <p className="text-sm text-gray-600">Categorías</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationLauncher;
