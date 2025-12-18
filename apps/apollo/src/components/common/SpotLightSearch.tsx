import { Spotlight, spotlight } from '@mantine/spotlight';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAppFormBasicInfoByPartnerLoanId } from '@/lib/queries/shield/services';
import { Group, Radio } from '@mantine/core';

export default function SpotLightSearch() {
  const [query, setQuery] = useState('');
  const [searchBy, setSearchBy] = useState<string>('appFormId');
  const router = useRouter();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && query != '') {
      if (searchBy == 'appFormId') {
        spotlight.close();
        router.push(`/application/${query}/appForm`);
      } else if (searchBy == 'partnerLoanId') {
        getAppFormBasicInfoByPartnerLoanId(query, 'appFormBasic')
          .then((res) => {
            spotlight.close();
            const appFormId = res.id;
            router.push(`/application/${appFormId}/appForm`);
          })
          .catch(() => {
            // TODO : throw error
          });
      }
    }
  };

  return (
    <>
      <Spotlight.Root query={query} onQueryChange={setQuery}>
        <Radio.Group value={searchBy} name="searchBy" onChange={setSearchBy}>
          <Group>
            <Radio variant="outline" value="appFormId" label="AppForm Id" />
            <Radio
              variant="outline"
              value="partnerLoanId"
              label="Partner Loan Id"
            />
          </Group>
        </Radio.Group>
        <Spotlight.Search placeholder="Search..." onKeyDown={handleKeyDown} />
        <Spotlight.ActionsList />
      </Spotlight.Root>
    </>
  );
}
