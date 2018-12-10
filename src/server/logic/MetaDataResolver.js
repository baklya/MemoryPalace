import metascraper from 'metascraper';
import got from 'got';

const cache = {};

const metaDataResolve = async (link) => {

	if (cache[link]) {
		return cache[link];
	}

	const { body: html, url } = await got(link)
	const metadata = await metascraper({ html, url })

	cache[link] = metadata;

	return metadata;
}




exports.metaDataResolve = metaDataResolve;
