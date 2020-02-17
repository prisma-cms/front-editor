import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

class FalleryFilesRenderer extends PureComponent {

  static propTypes = {
    object: PropTypes.object.isRequired,
    getObjectWithMutations: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    dirty: PropTypes.object,
    Grid: PropTypes.func.isRequired,
    Image: PropTypes.func.isRequired,
  };

  render() {

    const {
      object,
      getObjectWithMutations,
      name,
      dirty: _dirty,
      Grid,
      Image,
    } = this.props;

    if (!getObjectWithMutations) {
      return null;
    }

    const {
      [name]: files,
    } = object || {}

    const {
      [name]: dirty_files,
    } = _dirty || {}

    let Files = [].concat(files || []);

    // console.log('dirty_files', dirty_files);

    if (dirty_files && dirty_files.connect && Array.isArray(dirty_files.connect)) {
      // Files = Files.concat(dirty_files.connect);
      Files = Files.concat(dirty_files.connect.map(n => ({
        connect: {
          id: n.id,
        },
      })));
    }

    // console.log('Files', Files);

    const items = Files.map((n, index) => {
      let item = null;

      const {
        id,
        path,
        connect,
      } = n;

      let src = path;

      if (connect && typeof connect === "object") {

        const {
          id: newFileId,
        } = connect;

        if (newFileId) {

          const query = gql`query file (
          $where: FileWhereUniqueInput!
        ){
          object: file (
            where: $where
          ){
            ...file
          }
        }

        fragment file on File {
          id
          path
        }`;

          item = <Query
            key={id || index}
            query={query}
            variables={{
              where: {
                id: newFileId
              },
            }}
          >
            {({ data }) => {

              // console.log('Query data', data);

              const {
                path,
              } = (data && data.object) || {};

              return path ?
                <Grid
                  key={id || index}
                  item
                >
                  <Image
                    src={path}
                  />
                </Grid> :
                null;
            }}
          </Query>

        }

      }

      if (src) {

        item = <Grid
          key={id || index}
          item
        >
          <Image
            src={src}
          />
        </Grid>
      }

      return item;
    }).filter(n => n);

    return <Grid
      container
      spacing={8}
    >
      {items}
    </Grid>
  }
}


export default FalleryFilesRenderer;