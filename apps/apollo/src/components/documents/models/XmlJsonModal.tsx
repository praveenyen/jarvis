import CustomIcon from '@/components/icons/CustomIcons';
import { AadhaarData } from '@/lib/queries/shield/queryResponseTypes';
import domtoimage from 'dom-to-image';
import {
  ActionIcon,
  Badge,
  Box,
  Flex,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useRef } from 'react';

type Props = {
  xmlData: AadhaarData | null;
};

export function XmlJsonModal({ xmlData }: Props) {
  if (!xmlData) return null;

  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (!contentRef.current) return;
    try {
      const dataUrl = await domtoimage.toJpeg(contentRef.current);
      const link = document.createElement('a');
      link.download = 'aadhaar-xml-preview.jpeg';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export image:', error);
    }
  };

  const handlePrint = () => {
    if (!contentRef.current) return;

    const html = contentRef.current.outerHTML;
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head><title>Print Preview</title></head>
        <body>
          <div id="print-content">${html}</div>
        </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = () => {
      document
        .querySelectorAll('style, link[rel="stylesheet"]')
        .forEach((el) => {
          printWindow.document.head.appendChild(el.cloneNode(true));
        });

      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 300);
    };
  };

  const isValid = xmlData.verified === 'true';

  const Field = ({ label, value }: { label: string; value?: string }) => (
    <Flex justify="space-between" gap={8}>
      <Text size="xs" style={{ color: '#555', width: '40%' }}>
        {label}
      </Text>
      <Text size="xs" style={{ width: '60%', textAlign: 'right' }}>
        {value || '-'}
      </Text>
    </Flex>
  );

  return (
    <Box>

      <Group justify="flex-end" pb={5} mb="xs">
        <ActionIcon variant="transparent">
          <CustomIcon
            title="Download"
            src="MaterialIcon"
            name="MdDownloading"
            size="28px"
            onClick={handleDownloadImage}
          />
        </ActionIcon>
        <ActionIcon variant="transparent">
          <CustomIcon
            title="Print"
            src="MaterialIcon"
            name="MdLocalPrintshop"
            size="28px"
            onClick={handlePrint}
          />
        </ActionIcon>
      </Group>

      <Box
        ref={contentRef}
        p="md"
        style={{
          backgroundColor: '#fff',
          fontSize: 2,
          color: '#000',
          overflowY: 'auto',
        }}
      >
        <Stack gap="1">
          <Group
            justify="space-between"
            align="center"
            pb={5}
            mb="xs"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.2)' }}
          >
            <Title order={4} style={{ fontSize: 18, color: '#000' }}>
              Aadhaar Offline e-KYC
            </Title>
            <Badge color={isValid ? 'green' : 'red'} size="sm" radius="sm">
              {isValid ? 'Valid XML' : 'Invalid XML'}
            </Badge>
          </Group>

          <Grid gutter="xs">
            <Grid.Col span={9}>
              {/* Identity Section */}
              <Stack style={{ borderBottom: '1px solid #ccc' }} gap="xs">
                <Title order={5} style={{ fontSize: 14, color: '#000' }}>
                  Proof of Identity
                </Title>
                <Field label="Aadhaar Response Code" value={xmlData.referenceId} />
                <Field label="Name" value={xmlData.name} />
                <Field label="Date of Birth" value={xmlData.dob} />
                <Field label="Gender" value={xmlData.gender} />
              </Stack>

              {/* Address Section */}
              <Stack style={{ borderBottom: '1px solid #ccc' }} gap="xs">
                <Title order={5} style={{ fontSize: 14, color: '#000' }}>
                  Proof of Address
                </Title>
                <Field label="Care of" value={xmlData.careof} />
                <Field label="House No." value={xmlData.house} />
                <Field label="Street" value={xmlData.street} />
                <Field label="Landmark" value={xmlData.landmark} />
                <Field label="Locality" value={xmlData.loc} />
                <Field label="VTC" value={xmlData.vtc} />
                <Field label="Sub District" value={xmlData.subdist} />
                <Field label="District" value={xmlData.dist} />
                <Field label="State" value={xmlData.state} />
                <Field label="Pin Code" value={xmlData.pc} />
                <Field label="Post Office" value={xmlData.po || xmlData.loc} />
              </Stack>

              {/* Mode Section */}
              <Stack>
                <Field label="Mode of Offline e-KYC" value="Digital-XML" />
              </Stack>
            </Grid.Col>

            <Grid.Col span={3}>
              {xmlData.Pht && (
                <Box
                  style={{
                    width: 100,
                    height: 120,
                    border: '1px solid #ccc',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={xmlData.Pht}
                    alt="Aadhaar"
                    fit="contain"
                    width="100%"
                    height="100%"
                  />
                </Box>
              )}
            </Grid.Col>
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
}