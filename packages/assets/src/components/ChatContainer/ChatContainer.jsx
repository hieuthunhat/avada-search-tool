import React, {useState} from 'react';
import {Card} from '@shopify/polaris';
import {
  ResourceItem,
  ResourceList,
  Box,
  Text,
  FormLayout,
  TextField,
  InlineStack,
  Button
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

  const movies = data?.movies || [];

  const renderItem = useCallback(item => {
    const {title, id, overview} = item;
    return (
      <ResourceItem
        id={id}
        key={id}
        url={`#movie-${id}`}
        accessibilityLabel={`View details for ${title}`}
      >
        <Box>
          <Text as="h2">{title}</Text>
          <Text as="p">{overview}</Text>
        </Box>
      </ResourceItem>
    );
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetchApi(null, {query: value});
      setValue('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = useCallback(newValue => setValue(newValue), []);

  return (
    <Card background="bg-surface-secondary" padding="200" roundedAbove="md">
      <Box width="300" minHeight="60vh" background="bg-surface">
        <ResourceList
          loading={loading || fetchLoading}
          items={movies}
          renderItem={renderItem}
          resourceName={{singular: 'movie', plural: 'movies'}}
          accessibilityLabel="Search results for movies"
        />
      </Box>
      <FormLayout>
        <Box as="div" background="bg-surface-secondary" borderRadius="100">
          <InlineStack gap={200} blockAlign="center" align="center">
            <TextField
              value={value}
              onChange={handleChange}
              autoComplete="off"
              type="text"
              size="slim"
              align="center"
            />
            <Button onClick={handleSubmit} loading={loading} variant="primary">
              Submit
            </Button>
          </InlineStack>
        </Box>
      </FormLayout>
    </Card>
  );
};
export default ChatContainer;
