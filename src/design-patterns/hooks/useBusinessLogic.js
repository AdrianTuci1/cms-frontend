/**
 * useBusinessLogic - Hook pentru Business Logic
 * Integrează Strategy Pattern cu React pentru logica business-specific
 * Updated pentru noua structură API din requests.md
 */

import { useCallback, useMemo } from 'react';
import { StrategyRegistry } from '../strategy/base/StrategyRegistry';

/**
 * Hook pentru business logic
 * @param {string} businessType - Tipul de business (dental, gym, hotel)
 * @returns {Object} Funcții pentru business logic
 */
export const useBusinessLogic = (businessType) => {
  const strategy = useMemo(() => {
    return StrategyRegistry.get(businessType);
  }, [businessType]);

  /**
   * Procesează datele conform strategiei business
   * @param {*} data - Datele de procesat
   * @param {string} dataType - Tipul de date (timeline, clients, packages, members, invoices, stocks, sales, agent, history, workflows, reports, roles, permissions, userData)
   * @returns {*} Datele procesate
   */
  const processData = useCallback((data, dataType) => {
    if (!strategy) {
      console.warn(`No strategy found for business type: ${businessType}`);
      return data;
    }

    try {
      switch (dataType) {
        case 'timeline':
          return strategy.processTimelineData ? strategy.processTimelineData(data) : data;
        case 'clients':
          return strategy.processClientsData ? strategy.processClientsData(data) : data;
        case 'packages':
          return strategy.processPackagesData ? strategy.processPackagesData(data) : data;
        case 'members':
          return strategy.processMembersData ? strategy.processMembersData(data) : data;
        case 'invoices':
          return strategy.processInvoicesData ? strategy.processInvoicesData(data) : data;
        case 'stocks':
          return strategy.processStocksData ? strategy.processStocksData(data) : data;
        case 'sales':
          return strategy.processSalesData ? strategy.processSalesData(data) : data;
        case 'agent':
          return strategy.processAgentData ? strategy.processAgentData(data) : data;
        case 'history':
          return strategy.processHistoryData ? strategy.processHistoryData(data) : data;
        case 'workflows':
          return strategy.processWorkflowsData ? strategy.processWorkflowsData(data) : data;
        case 'reports':
          return strategy.processReportsData ? strategy.processReportsData(data) : data;
        case 'roles':
          return strategy.processRolesData ? strategy.processRolesData(data) : data;
        case 'permissions':
          return strategy.processPermissionsData ? strategy.processPermissionsData(data) : data;
        case 'userData':
          return strategy.processUserDataData ? strategy.processUserDataData(data) : data;
        default:
          return strategy.processData ? strategy.processData(data, dataType) : data;
      }
    } catch (error) {
      console.error(`Error processing ${dataType} data for ${businessType}:`, error);
      return data;
    }
  }, [strategy, businessType]);

  /**
   * Validează datele conform strategiei business
   * @param {*} data - Datele de validat
   * @param {string} dataType - Tipul de date
   * @returns {Object} Rezultatul validării
   */
  const validateData = useCallback((data, dataType) => {
    if (!strategy) {
      return { isValid: true, errors: [] };
    }

    try {
      switch (dataType) {
        case 'timeline':
          return strategy.validateTimeline ? strategy.validateTimeline(data) : { isValid: true, errors: [] };
        case 'client':
          return strategy.validateClient ? strategy.validateClient(data) : { isValid: true, errors: [] };
        case 'package':
          return strategy.validatePackage ? strategy.validatePackage(data) : { isValid: true, errors: [] };
        case 'member':
          return strategy.validateMember ? strategy.validateMember(data) : { isValid: true, errors: [] };
        case 'invoice':
          return strategy.validateInvoice ? strategy.validateInvoice(data) : { isValid: true, errors: [] };
        case 'stock':
          return strategy.validateStock ? strategy.validateStock(data) : { isValid: true, errors: [] };
        case 'sale':
          return strategy.validateSale ? strategy.validateSale(data) : { isValid: true, errors: [] };
        case 'agent':
          return strategy.validateAgent ? strategy.validateAgent(data) : { isValid: true, errors: [] };
        case 'workflow':
          return strategy.validateWorkflow ? strategy.validateWorkflow(data) : { isValid: true, errors: [] };
        case 'report':
          return strategy.validateReport ? strategy.validateReport(data) : { isValid: true, errors: [] };
        case 'role':
          return strategy.validateRole ? strategy.validateRole(data) : { isValid: true, errors: [] };
        case 'permission':
          return strategy.validatePermission ? strategy.validatePermission(data) : { isValid: true, errors: [] };
        case 'userData':
          return strategy.validateUserData ? strategy.validateUserData(data) : { isValid: true, errors: [] };
        default:
          return strategy.validateData ? strategy.validateData(data, dataType) : { isValid: true, errors: [] };
      }
    } catch (error) {
      console.error(`Error validating ${dataType} data for ${businessType}:`, error);
      return { isValid: false, errors: [error.message] };
    }
  }, [strategy, businessType]);

  /**
   * Calculează valori business-specific
   * @param {string} calculationType - Tipul de calcul
   * @param {*} data - Datele pentru calcul
   * @returns {*} Rezultatul calculului
   */
  const calculate = useCallback((calculationType, data) => {
    if (!strategy) {
      console.warn(`No strategy found for business type: ${businessType}`);
      return null;
    }

    try {
      switch (calculationType) {
        case 'duration':
          return strategy.calculateDuration ? strategy.calculateDuration(data) : null;
        case 'price':
          return strategy.calculatePrice ? strategy.calculatePrice(data) : null;
        case 'priority':
          return strategy.calculatePriority ? strategy.calculatePriority(data) : null;
        case 'availability':
          return strategy.calculateAvailability ? strategy.calculateAvailability(data) : null;
        case 'capacity':
          return strategy.calculateCapacity ? strategy.calculateCapacity(data) : null;
        case 'revenue':
          return strategy.calculateRevenue ? strategy.calculateRevenue(data) : null;
        case 'profit':
          return strategy.calculateProfit ? strategy.calculateProfit(data) : null;
        case 'inventory':
          return strategy.calculateInventory ? strategy.calculateInventory(data) : null;
        default:
          return strategy.calculate ? strategy.calculate(calculationType, data) : null;
      }
    } catch (error) {
      console.error(`Error calculating ${calculationType} for ${businessType}:`, error);
      return null;
    }
  }, [strategy, businessType]);

  /**
   * Generează formatări business-specific
   * @param {string} formatType - Tipul de formatare
   * @param {*} data - Datele de formatat
   * @returns {string} Textul formatat
   */
  const format = useCallback((formatType, data) => {
    if (!strategy) {
      return String(data);
    }

    try {
      switch (formatType) {
        case 'timeline':
          return strategy.formatTimeline ? strategy.formatTimeline(data) : String(data);
        case 'client':
          return strategy.formatClient ? strategy.formatClient(data) : String(data);
        case 'package':
          return strategy.formatPackage ? strategy.formatPackage(data) : String(data);
        case 'member':
          return strategy.formatMember ? strategy.formatMember(data) : String(data);
        case 'invoice':
          return strategy.formatInvoice ? strategy.formatInvoice(data) : String(data);
        case 'stock':
          return strategy.formatStock ? strategy.formatStock(data) : String(data);
        case 'sale':
          return strategy.formatSale ? strategy.formatSale(data) : String(data);
        case 'price':
          return strategy.formatPrice ? strategy.formatPrice(data) : String(data);
        case 'time':
          return strategy.formatTime ? strategy.formatTime(data) : String(data);
        case 'date':
          return strategy.formatDate ? strategy.formatDate(data) : String(data);
        default:
          return strategy.format ? strategy.format(formatType, data) : String(data);
      }
    } catch (error) {
      console.error(`Error formatting ${formatType} for ${businessType}:`, error);
      return String(data);
    }
  }, [strategy, businessType]);

  /**
   * Obține configurații business-specific
   * @param {string} configType - Tipul de configurație
   * @returns {*} Configurația
   */
  const getConfig = useCallback((configType) => {
    if (!strategy) {
      return null;
    }

    try {
      switch (configType) {
        case 'timelineSlots':
          return strategy.getTimelineSlots ? strategy.getTimelineSlots() : null;
        case 'clientFields':
          return strategy.getClientFields ? strategy.getClientFields() : null;
        case 'packageFields':
          return strategy.getPackageFields ? strategy.getPackageFields() : null;
        case 'memberFields':
          return strategy.getMemberFields ? strategy.getMemberFields() : null;
        case 'invoiceFields':
          return strategy.getInvoiceFields ? strategy.getInvoiceFields() : null;
        case 'stockFields':
          return strategy.getStockFields ? strategy.getStockFields() : null;
        case 'saleFields':
          return strategy.getSaleFields ? strategy.getSaleFields() : null;
        case 'workflowFields':
          return strategy.getWorkflowFields ? strategy.getWorkflowFields() : null;
        case 'reportFields':
          return strategy.getReportFields ? strategy.getReportFields() : null;
        case 'roleFields':
          return strategy.getRoleFields ? strategy.getRoleFields() : null;
        case 'permissionFields':
          return strategy.getPermissionFields ? strategy.getPermissionFields() : null;
        default:
          return strategy.getConfig ? strategy.getConfig(configType) : null;
      }
    } catch (error) {
      console.error(`Error getting config ${configType} for ${businessType}:`, error);
      return null;
    }
  }, [strategy, businessType]);

  /**
   * Verifică dacă o operație este permisă
   * @param {string} operation - Operația de verificat
   * @param {*} data - Datele pentru verificare
   * @returns {boolean} Dacă operația este permisă
   */
  const isOperationAllowed = useCallback((operation, data) => {
    if (!strategy) {
      return true;
    }

    try {
      switch (operation) {
        case 'createTimeline':
          return strategy.canCreateTimeline ? strategy.canCreateTimeline(data) : true;
        case 'updateTimeline':
          return strategy.canUpdateTimeline ? strategy.canUpdateTimeline(data) : true;
        case 'deleteTimeline':
          return strategy.canDeleteTimeline ? strategy.canDeleteTimeline(data) : true;
        case 'createClient':
          return strategy.canCreateClient ? strategy.canCreateClient(data) : true;
        case 'updateClient':
          return strategy.canUpdateClient ? strategy.canUpdateClient(data) : true;
        case 'deleteClient':
          return strategy.canDeleteClient ? strategy.canDeleteClient(data) : true;
        case 'createPackage':
          return strategy.canCreatePackage ? strategy.canCreatePackage(data) : true;
        case 'updatePackage':
          return strategy.canUpdatePackage ? strategy.canUpdatePackage(data) : true;
        case 'deletePackage':
          return strategy.canDeletePackage ? strategy.canDeletePackage(data) : true;
        case 'createMember':
          return strategy.canCreateMember ? strategy.canCreateMember(data) : true;
        case 'updateMember':
          return strategy.canUpdateMember ? strategy.canUpdateMember(data) : true;
        case 'deleteMember':
          return strategy.canDeleteMember ? strategy.canDeleteMember(data) : true;
        case 'createInvoice':
          return strategy.canCreateInvoice ? strategy.canCreateInvoice(data) : true;
        case 'updateInvoice':
          return strategy.canUpdateInvoice ? strategy.canUpdateInvoice(data) : true;
        case 'deleteInvoice':
          return strategy.canDeleteInvoice ? strategy.canDeleteInvoice(data) : true;
        case 'createStock':
          return strategy.canCreateStock ? strategy.canCreateStock(data) : true;
        case 'updateStock':
          return strategy.canUpdateStock ? strategy.canUpdateStock(data) : true;
        case 'deleteStock':
          return strategy.canDeleteStock ? strategy.canDeleteStock(data) : true;
        case 'createSale':
          return strategy.canCreateSale ? strategy.canCreateSale(data) : true;
        case 'updateSale':
          return strategy.canUpdateSale ? strategy.canUpdateSale(data) : true;
        case 'deleteSale':
          return strategy.canDeleteSale ? strategy.canDeleteSale(data) : true;
        default:
          return strategy.isOperationAllowed ? strategy.isOperationAllowed(operation, data) : true;
      }
    } catch (error) {
      console.error(`Error checking operation ${operation} for ${businessType}:`, error);
      return false;
    }
  }, [strategy, businessType]);

  return {
    processData,
    validateData,
    calculate,
    format,
    getConfig,
    isOperationAllowed,
    businessType,
    strategy
  };
};

export default useBusinessLogic; 