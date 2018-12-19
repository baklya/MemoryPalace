import metascraper from 'metascraper';
import got from 'got';


import youtube from 'metascraper-youtube';



metascraper([youtube()])


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
