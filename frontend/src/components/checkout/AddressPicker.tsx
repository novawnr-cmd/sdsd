'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Address } from '@/types';

interface AddressPickerProps {
  onSelect: (address: Address) => void;
  savedAddresses?: Address[];
}

export default function AddressPicker({ onSelect, savedAddresses = [] }: AddressPickerProps) {
  const { t } = useLanguage();
  const [selectedSaved, setSelectedSaved] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    country: 'Saudi Arabia',
  });

  const handleSelectSaved = (addr: Address, index: number) => {
    setSelectedSaved(index);
    onSelect(addr);
  };

  const handleSaveNew = () => {
    if (newAddress.firstName && newAddress.phone && newAddress.address && newAddress.city) {
      onSelect(newAddress as Address);
    }
  };

  return (
    <div className="space-y-6">
      {savedAddresses.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-dark-800">{t('checkout.selectAddress')}</h4>
          {savedAddresses.map((addr, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.01 }}
              onClick={() => handleSelectSaved(addr, i)}
              className={`w-full text-start p-4 rounded-xl border-2 transition-all ${
                selectedSaved === i
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 dark:border-dark-100 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <FiMapPin size={20} className={selectedSaved === i ? 'text-primary' : 'text-gray-400'} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-dark-800">{addr.label}</p>
                  <p className="text-sm text-gray-500 dark:text-dark-300">
                    {addr.firstName} {addr.lastName} - {addr.address}, {addr.city}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-dark-300">{addr.phone}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <div>
        <h4 className="font-semibold text-gray-900 dark:text-dark-800 mb-4">{t('checkout.addNewAddress')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('checkout.firstName')}
            value={newAddress.firstName || ''}
            onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
          />
          <Input
            label={t('checkout.lastName')}
            value={newAddress.lastName || ''}
            onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
          />
          <Input
            label={t('checkout.phone')}
            value={newAddress.phone || ''}
            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
          />
          <Input
            label={t('checkout.city')}
            value={newAddress.city || ''}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
          />
          <div className="md:col-span-2">
            <Input
              label={t('checkout.address')}
              value={newAddress.address || ''}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-100 rounded-xl border-2 border-dashed border-gray-300 dark:border-dark-200">
          <div className="flex items-center gap-3 text-gray-400 dark:text-dark-300">
            <FiMapPin size={24} />
            <div>
              <p className="text-sm font-medium">{t('checkout.selectLocation')}</p>
              <p className="text-xs">{t('checkout.selectLocation')}</p>
            </div>
          </div>
        </div>

        <Button onClick={handleSaveNew} className="mt-4">
          {t('checkout.saveAddress')}
        </Button>
      </div>
    </div>
  );
}
