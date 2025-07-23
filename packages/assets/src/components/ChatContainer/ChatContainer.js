import React, {useState} from 'react';
import {Card, Thumbnail, Divider, EmptyState} from '@shopify/polaris';
import {
  ResourceItem,
  ResourceList,
  Box,
  Text,
  FormLayout,
  TextField,
  InlineStack,
  Button,
  BlockStack
} from '@shopify/polaris';
import {useCallback} from 'react';
import useFetchApi from '../../hooks/api/useFetchApi';

const ChatContainer = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const {fetchApi, data, loading: fetchLoading} = useFetchApi({
    url: '/search-tool',
    initLoad: false
  });

  const products = data?.products || [];
  const answer = data?.answer;

  const renderItem = useCallback(item => {
    const {id, name, price, image, type} = item;
    return (
      <ResourceItem
        id={id}
        key={id}
        url={`#product-${id}`}
        accessibilityLabel={`View details for ${name}`}
      >
        <InlineStack gap="300" align="start">
          <Box minWidth="80px">
            <Thumbnail
              source={image || 'https://via.placeholder.com/80x80'}
              alt={name}
              size="large"
            />
          </Box>
          <BlockStack gap="200" inlineAlign="start">
            <Text variant="headingMd" as="h3" fontWeight="semibold">
              {name}
            </Text>
            <InlineStack gap="400" align="start">
              <Text variant="bodyMd" color="subdued">
                Type: {type}
              </Text>
              <Text variant="bodyMd" fontWeight="medium" color="success">
                ${price}
              </Text>
            </InlineStack>
          </BlockStack>
        </InlineStack>
      </ResourceItem>
    );
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetchApi(null, {query: value});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = useCallback(newValue => setValue(newValue), []);

  const handleKeyPress = useCallback(
    event => {
      if (event.key === 'Enter' && !loading) {
        handleSubmit();
      }
    },
    [loading, handleSubmit]
  );

  return (
    <Card>
      <BlockStack gap="400">
        <Box padding="400" background="bg-surface-secondary" borderRadius="200">
          <FormLayout>
            <FormLayout.Group>
              <TextField
                label="Search Products"
                labelHidden
                value={value}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Search for products..."
                autoComplete="off"
                clearButton
                onClearButtonClick={() => setValue('')}
                connectedRight={
                  <Button
                    onClick={handleSubmit}
                    loading={loading}
                    variant="primary"
                    disabled={!value.trim()}
                  >
                    Search
                  </Button>
                }
              />
            </FormLayout.Group>

            {(products.length > 0 || answer) && (
              <FormLayout.Group>
                <InlineStack gap="400" align="start">
                  {products.length > 0 && (
                    <Text variant="bodyMd" color="subdued">
                      Found {products.length} product{products.length !== 1 ? 's' : ''}
                    </Text>
                  )}
                  {answer && (
                    <Text variant="bodyMd" color="success">
                      AI Response Available
                    </Text>
                  )}
                </InlineStack>
              </FormLayout.Group>
            )}
          </FormLayout>
        </Box>

        <Divider />

        {/* Results Section */}
        <Box padding="400">
          <FormLayout>
            {answer && (
              <FormLayout.Group>
                <Box
                  padding="400"
                  background="bg-surface-info-subdued"
                  borderRadius="200"
                  borderColor="border-info"
                  borderWidth="025"
                >
                  <BlockStack gap="200">
                    <Text variant="headingMd" as="h2">
                      AI Assistant
                    </Text>
                    <Box style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                      <Text variant="bodyMd" as="p">
                        {answer}
                      </Text>
                    </Box>
                  </BlockStack>
                </Box>
              </FormLayout.Group>
            )}

            {/* Products Section */}
            <FormLayout.Group>
              {products.length > 0 ? (
                <BlockStack gap="300">
                  <Text variant="headingLg" as="h2">
                    Products Found ({products.length})
                  </Text>
                  <ResourceList
                    loading={loading || fetchLoading}
                    items={products}
                    renderItem={renderItem}
                    resourceName={{singular: 'product', plural: 'products'}}
                    accessibilityLabel="Search results for products"
                  />
                </BlockStack>
              ) : !loading && !fetchLoading && value ? (
                <EmptyState
                  heading="No products found"
                  action={{
                    content: 'Try different keywords',
                    onAction: () => setValue('')
                  }}
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <p>
                    We couldn&apos;t find any products matching &quot;{value}&quot;. Try adjusting
                    search terms.
                  </p>
                </EmptyState>
              ) : (
                <Box textAlign="center" paddingBlock="800">
                  <Text variant="bodyLg" color="subdued">
                    Enter a search query to find products
                  </Text>
                </Box>
              )}
            </FormLayout.Group>
          </FormLayout>
        </Box>
      </BlockStack>
    </Card>
  );
};

export default ChatContainer;
