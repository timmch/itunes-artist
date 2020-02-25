import React from 'react';
import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';
import './App.css';

class Album extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        releaseYear: new Date(props.releaseDate).getFullYear(),
        // iTunes returns urls for 100x100 and 60x60 pixel sizes AND there is an unlisted 600x600 image available as well
        albumArtWork: props.artWork.replace("100x100", "600x600"),
    };
  }

  render() {
    return(
      <li className="album">
        <a href={this.props.linkToiTunes} target="_blank" className="cell album-cover">
          <img src={this.state.albumArtWork} alt="album-cover" />
        </a>
        <a href={this.props.linkToiTunes} target="_blank" className="cell">
          <h4 className="cell">
            <span className={this.props.collectionExplicitness}>
              {this.props.title}
            </span>
          </h4>
        </a>
        <div className="cell tableOnly">
          {this.props.album.artistName}
        </div>
        <h5 className="cell">{this.state.releaseYear}</h5>
        <div className="cell tableOnly">
          {this.props.album.primaryGenreName}
        </div>
      </li>
    );
  }
}

class AlbumList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'listSelected',
    };

    this.listSelected = this.listSelected.bind(this);
    this.gridSelected = this.gridSelected.bind(this);
  }

  listSelected() {
    this.setState(state => ({
      view: 'listSelected',
    }));
  }

  gridSelected() {
    this.setState(state => ({
      view: 'gridSelected',
    }));
  }

  render() {
    const albums = this.props.albums;
    return(
      <div className={this.state.view}>
        <div className="albumsHeader">
          <h3>Albums</h3>
          <div className="albumsViewToggle">
            <span className="list" onClick={this.listSelected}>
              LIST&nbsp;
            </span>
            |
            <span className="grid" onClick={this.gridSelected}>
              &nbsp;GRID
            </span>
          </div>
        </div>
        <ul className="albumList">
          <li className="titleRow">
            <img className="cell album-cover" />
            <div className="cell">
              Title
            </div>
            <div className="cell tableOnly">Artist</div>
            <div className="cell">
              Release Year
            </div>
            <div className="cell tableOnly">Genre</div>
          </li>
          {albums.map((album) =>
            <Album
              album={album}
              title={album.collectionName}
              releaseDate={album.releaseDate}
              artWork={album.artworkUrl100}
              linkToiTunes={album.collectionViewUrl}
              key={album.collectionId}
              collectionExplicitness={album.collectionExplicitness}
            />
          )}
        </ul>
      </div>

    );
  }
}

class Artist extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      artist: {},
    }
  }

  componentDidMount() {
    axios(
      {
        url: 'https://itunes.apple.com/lookup?id=' + this.props.artistId + '&entity=album',
        adapter: jsonpAdapter,
      })
      .then(res => {
        let albums = res.data.results;
        let artist = albums.shift();
        albums.sort((a,b) => {
            return new Date(a.releaseDate).getTime() -
                new Date(b.releaseDate).getTime()
        }).reverse();
        this.setState({
          albums: albums,
          artist: artist,
        });
      });
  }

  render() {
    return (
      <div>
        <div className="artistCover">
          <h1>{this.state.artist.artistName}</h1>
          <h4>Primary Genre: {this.state.artist.primaryGenreName}</h4>
          <a href={this.state.artist.artistLinkUrl} target="_blank">View artist on iTunes</a>
        </div>
        <div className="artistBody">
          <AlbumList albums={this.state.albums} />
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Artist artistId="412778295" />
      </div>
    );
  }
}

export default App;
