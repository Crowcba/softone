'use client';

import React, { Suspense } from 'react';
import RegisterVisitForm from './RegisterVisitForm';
import { FormContainer } from '@/components/ui/FormComponents';
import { FormLoading } from '@/components/ui/FormComponents';

export default function RegisterVisitPage() {
  return (
    <FormContainer isNested={true}>
      <Suspense fallback={<FormLoading visible={true} />}>
        <RegisterVisitForm />
      </Suspense>
    </FormContainer>
  );
} 