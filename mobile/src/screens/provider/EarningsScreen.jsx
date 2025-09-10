import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';

const EarningsScreen = () => {
  const { t } = useLanguage();
  const [earnings, setEarnings] = useState({
    totalEarnings: 15750,
    thisMonth: 4200,
    thisWeek: 1150,
    availableForWithdrawal: 3890,
    pendingPayments: 850
  });

  const [transactions, setTransactions] = useState([
    {
      id: '1',
      jobTitle: 'Aari Embroidery Work',
      gross: 2500,
      quickjobFee: 375,
      net: 2125,
      status: 'completed',
      date: '2025-01-08',
      withdrawnAt: null
    },
    {
      id: '2',
      jobTitle: 'Mehendi Design',
      gross: 1500,
      quickjobFee: 225,
      net: 1275,
      status: 'completed',
      date: '2025-01-06',
      withdrawnAt: '2025-01-07'
    },
    {
      id: '3',
      jobTitle: 'Cooking Service',
      gross: 800,
      quickjobFee: 120,
      net: 680,
      status: 'pending',
      date: '2025-01-05',
      withdrawnAt: null
    }
  ]);

  const handleWithdraw = () => {
    if (earnings.availableForWithdrawal < 100) {
      Alert.alert('Minimum Withdrawal', 'Minimum withdrawal amount is ₹100');
      return;
    }

    Alert.alert(
      'Withdraw Earnings',
      `Withdraw ₹${earnings.availableForWithdrawal} to your UPI account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Success', 'Withdrawal request submitted. You will receive the amount within 2 hours.');
            // In real app, process withdrawal
          }
        }
      ]
    );
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Text style={styles.jobTitle}>{item.jobTitle}</Text>
        <View style={[styles.statusBadge, styles[`${item.status}Status`]]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.transactionDetails}>
        <View style={styles.amountBreakdown}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Gross Earning:</Text>
            <Text style={styles.amountValue}>₹{item.gross}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.feeLabel}>QuickJob Fee (15%):</Text>
            <Text style={styles.feeValue}>-₹{item.quickjobFee}</Text>
          </View>
          <View style={[styles.amountRow, styles.netRow]}>
            <Text style={styles.netLabel}>Net Earning:</Text>
            <Text style={styles.netValue}>₹{item.net}</Text>
          </View>
        </View>
        
        <View style={styles.transactionFooter}>
          <Text style={styles.dateText}>{item.date}</Text>
          {item.withdrawnAt && (
            <Text style={styles.withdrawnText}>
              Withdrawn on {item.withdrawnAt}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      
      {/* Header */}
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>{t('earnings')}</Text>
      </LinearGradient>

      {/* Earnings Summary */}
      <View style={styles.summaryContainer}>
        <LinearGradient
          colors={['#4CAF50', '#66BB6A']}
          style={styles.summaryCard}
        >
          <Text style={styles.summaryTitle}>Total Earnings</Text>
          <Text style={styles.totalEarnings}>₹{earnings.totalEarnings.toLocaleString()}</Text>
          
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹{earnings.thisMonth}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹{earnings.thisWeek}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Withdrawal Section */}
      <View style={styles.withdrawalContainer}>
        <View style={styles.withdrawalInfo}>
          <View>
            <Text style={styles.withdrawalTitle}>Available for Withdrawal</Text>
            <Text style={styles.withdrawalAmount}>₹{earnings.availableForWithdrawal}</Text>
            <Text style={styles.pendingText}>
              ₹{earnings.pendingPayments} pending from ongoing jobs
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.withdrawButton,
              earnings.availableForWithdrawal < 100 && styles.disabledButton
            ]}
            onPress={handleWithdraw}
            disabled={earnings.availableForWithdrawal < 100}
          >
            <Ionicons name="wallet" size={20} color="#FFFFFF" />
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.withdrawalNote}>
          Minimum withdrawal: ₹100 • Processing time: Within 2 hours
        </Text>
      </View>

      {/* Transactions */}
      <View style={styles.transactionsContainer}>
        <Text style={styles.transactionsTitle}>Recent Transactions</Text>
        
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.transactionsList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summaryContainer: {
    padding: 20,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    color: '#E8F5E8',
    marginBottom: 8,
  },
  totalEarnings: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#E8F5E8',
    marginTop: 4,
  },
  withdrawalContainer: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  withdrawalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  withdrawalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  withdrawalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 4,
  },
  pendingText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  withdrawButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#CBD5E1',
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  withdrawalNote: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  transactionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  transactionsList: {
    paddingBottom: 20,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedStatus: {
    backgroundColor: '#D1FAE5',
  },
  pendingStatus: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1E293B',
  },
  transactionDetails: {
    marginTop: 8,
  },
  amountBreakdown: {
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  amountLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  amountValue: {
    fontSize: 14,
    color: '#1E293B',
  },
  feeLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  feeValue: {
    fontSize: 14,
    color: '#EF4444',
  },
  netRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 4,
  },
  netLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  netValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  withdrawnText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
});

export default EarningsScreen;