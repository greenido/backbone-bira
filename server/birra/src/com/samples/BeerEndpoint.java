package com.samples;

import com.samples.PMF;

import com.google.api.server.spi.config.Api;

import java.util.List;

import javax.inject.Named;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import com.google.api.server.spi.config.ApiMethod;
import java.util.Collection;
import javax.annotation.Nullable;
import com.google.appengine.api.datastore.Cursor;
import java.util.HashMap;
import java.util.Map;
import org.datanucleus.store.appengine.query.JDOCursorHelper;
import com.google.api.server.spi.response.CollectionResponse;


import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.Consistency;
import com.google.appengine.api.search.Results;
import com.google.appengine.api.search.ScoredDocument;
import com.google.appengine.api.search.SearchServiceFactory;
import java.util.Date;
import com.google.api.server.spi.config.ApiMethod;
import java.util.ArrayList;



@Api(name = "birra")
public class BeerEndpoint {

  	 private static final Index INDEX = getIndex();
		
	 private static Index getIndex() {
		    IndexSpec indexSpec = IndexSpec.newBuilder()
		        .setName("beerindex")
		        .setConsistency(Consistency.PER_DOCUMENT)
		        .build();
		    return SearchServiceFactory.getSearchService().getIndex(indexSpec);
		}

	
  /**
   * This method lists all the entities inserted in datastore.
   * It uses HTTP GET method.
   *
   * @return List of all entities persisted.
   */
  @SuppressWarnings({"cast", "unchecked"})
  @ApiMethod(name="beers.list", path="beer")	
  public CollectionResponse<Beer> listBeers(@Nullable @Named("cursor") String cursorString, 
		  							       @Nullable @Named("limit") Integer limit) {
	  PersistenceManager mgr = null;
	  Cursor cursor = null;
	    List<Beer> execute = null;
	    try{
	      mgr = getPersistenceManager();
	      Query query = mgr.newQuery(Beer.class);
	      if (cursorString != null && cursorString != "") {
	         cursor = Cursor.fromWebSafeString(cursorString);
	         Map<String, Object> extensionMap = new HashMap<String, Object>();
	         extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
	         query.setExtensions(extensionMap);
	      }
		  if (limit != null) {
	         query.setRange(0, limit);
	      }
	      execute = (List<Beer>) query.execute();
	      cursor = JDOCursorHelper.getCursor(execute);
	      if (cursor != null) cursorString = cursor.toWebSafeString();
             else cursorString = "";
	      // Tight loop for fetching all entities from datastore and accomodate
	      // for lazy fetch.
	      for (Beer e:execute);
	    } finally {
	      mgr.close();
	    }

	    return CollectionResponse.<Beer>builder()
	        .setItems(execute)
	        .setNextPageToken(cursorString)
	        .build();
	  }

  /**
   * This method gets the entity having primary key id. It uses HTTP GET method.
   *
   * @param id the primary key of the java bean.
   * @return The entity with primary key id.
   */
  @ApiMethod(name="beers.get")
  public Beer getBeer(@Named("id") Long id) {
    PersistenceManager mgr = getPersistenceManager();
    Beer beer  = null;
    try {
      beer = mgr.getObjectById(Beer.class, id);
    } finally {
      mgr.close();
    }
    return beer;
  }

  /**
   * This inserts the entity into App Engine datastore.
   * It uses HTTP POST method.
   *
   * @param beer the entity to be inserted.
   * @return The inserted entity.
   */
  @ApiMethod(name="beers.insert")
  public Beer insertBeer(Beer beer) {
    PersistenceManager mgr = getPersistenceManager();
    try {
      mgr.makePersistent(beer);
    } finally {
      mgr.close();
    }
    addBeerToSearchIndex (beer);
    return beer;
  }

  /**
   * This method is used for updating a entity.
   * It uses HTTP PUT method.
   *
   * @param beer the entity to be updated.
   * @return The updated entity.
   */
  @ApiMethod(name="beers.update")
  public Beer updateBeer(Beer beer) {
	beer = Beer.Merge(getBeer(beer.getId()), beer);
    PersistenceManager mgr = getPersistenceManager();
    try {
      mgr.makePersistent(beer);
    } finally {
      mgr.close();
    }
    addBeerToSearchIndex(beer);
    return beer;
  }

  /**
   * This method removes the entity with primary key id.
   * It uses HTTP DELETE method.
   *
   * @param id the primary key of the entity to be deleted.
   * @return The deleted entity.
   */
  @ApiMethod(name="beers.delete")
  public Beer removeBeer(@Named("id") Long id) {
    PersistenceManager mgr = getPersistenceManager();
     Beer beer  = null;
    try {
      beer = mgr.getObjectById(Beer.class, id);
      mgr.deletePersistent(beer);
    } finally {
      mgr.close();
    }
    return beer;
  }
  

  @ApiMethod (httpMethod="GET", name="beer.search")
	public List<Beer> searchBeer(@Named("term") String queryString) {

	  List<Beer> beerList = new ArrayList<Beer>();
      Results<ScoredDocument> results = INDEX.search(queryString);

      for (ScoredDocument scoredDoc : results) {
	      Field f = scoredDoc.getOnlyField("id");
	      if (f == null || f.getText() == null) continue;

         long beerId = Long.parseLong(f.getText());
 	     if (beerId != -1) {
 	        Beer b = getBeer(beerId);
 	        beerList.add(b);
 	     }
      }
     return beerList;
  }
  


  private static void addBeerToSearchIndex(Beer b) {
      Document.Builder docBuilder = Document.newBuilder()
                    .addField(Field.newBuilder().setName("name")
                        .setText(b.getBeerName() != null ? b.getBeerName() : "" ))
                    .addField(Field.newBuilder().setName("id")
                        .setText(Long.toString(b.getId())))
                    .addField(Field.newBuilder().setName("country")
                        .setText(b.getCountry() != null ? b.getCountry() : ""))
                    .addField(Field.newBuilder().setName("kind")
                        .setText(b.getKindOfBeer() != null ? b.getKindOfBeer() : ""))
                    .addField(Field.newBuilder().setName("latitude")
                        .setNumber(b.getLatitude() != null ? b.getLatitude() : 0))
                    .addField(Field.newBuilder().setName("longitude")
                        .setNumber(b.getLongitude() != null ? b.getLongitude() : 0))
                    .addField(Field.newBuilder().setName("description")
                        .setText(b.getDescription() != null ? b.getDescription() : ""))
                    .addField(Field.newBuilder().setName("score")
                        .setNumber(b.getScore() != null ? b.getScore() : 0))                
                    .addField(Field.newBuilder().setName("numberOfDrinks")
                        .setNumber(b.getNumberOfDrinks() != null ? b.getNumberOfDrinks() : 0))  
                    .addField(Field.newBuilder().setName("published")
                    	.setDate(Field.date(new Date())));
        docBuilder.setId(Long.toString(b.getId()));
        Document doc = docBuilder.build();
        INDEX.add(doc);
     }


  private static PersistenceManager getPersistenceManager() {
    return PMF.get().getPersistenceManager();
  }

}
