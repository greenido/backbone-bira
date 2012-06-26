package com.samples;

import com.samples.PMF;

import com.google.api.server.spi.config.Api;

import java.util.List;

import javax.inject.Named;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.google.api.server.spi.config.ApiMethod;

import java.util.List;
@Api(name = "birra")
public class CommentEndpoint {

  /**
   * This method lists all the entities inserted in datastore.
   * It uses HTTP GET method.
   *
   * @return List of all entities persisted.
   */
  @SuppressWarnings({"cast", "unchecked"})

@ApiMethod(name="beers.comments.list", 
             path="beers/{beerId}/comments")
public List<Comment> listComment(@Named ("beerId") Long beerId) {
    PersistenceManager mgr = getPersistenceManager();
    List<Comment> result = null;
    try{
      Query query = mgr.newQuery(Comment.class, "beerId == " + beerId);
      result = (List<Comment>) query.execute();
      // Tight loop for fetching all entities from datastore and accommodate
      // for lazy fetch.
      for (Comment comment:result);
    } finally {
      mgr.close();
    }
    return result;
  }

  /**
   * This method gets the entity having primary key id. It uses HTTP GET method.
   *
   * @param id the primary key of the java bean.
   * @return The entity with primary key id.
   */
  @ApiMethod(name="beers.comments.get", 
		   path="beers/{beerId}/comments/{id}") 
public Comment getComment(@Named ("beerId") Long beerId, @Named("id") Long id) {
    PersistenceManager mgr = getPersistenceManager();
    Comment comment  = null;
    try {
      comment = mgr.getObjectById(Comment.class, id);
    } finally {
      mgr.close();
    }
    return comment;
  }

  /**
   * This inserts the entity into App Engine datastore.
   * It uses HTTP POST method.
   *
   * @param comment the entity to be inserted.
   * @return The inserted entity.
   */
  @ApiMethod(name="beers.comments.insert", 
          path="beers/{beerId}/comments")
public Comment insertComment(@Named ("beerId") Long beerId, Comment comment) {
   comment.setBeerId(beerId);
   PersistenceManager mgr = getPersistenceManager();
    try {
      mgr.makePersistent(comment);
    } finally {
      mgr.close();
    }
    return comment;
  }

  /**
   * This method is used for updating a entity.
   * It uses HTTP PUT method.
   *
   * @param comment the entity to be updated.
   * @return The updated entity.
   */
  @ApiMethod(name="beers.comments.update",
          path="beers/{beerId}/comments")
public Comment updateComment(@Named ("beerId") Long beerId, Comment comment) {
   comment.setBeerId(beerId);
   PersistenceManager mgr = getPersistenceManager();
    try {
      mgr.makePersistent(comment);
    } finally {
      mgr.close();
    }
    return comment;
  }

  /**
   * This method removes the entity with primary key id.
   * It uses HTTP DELETE method.
   *
   * @param id the primary key of the entity to be deleted.
   * @return The deleted entity.
   */
  @ApiMethod(name="beers.comments.delete",
		   path="beers/{beerId}/comments/{commentId}")
 public Comment removeComment(@Named ("beerId") Long beerId, @Named("commentId") Long id) {
    PersistenceManager mgr = getPersistenceManager();
     Comment comment  = null;
    try {
      comment = mgr.getObjectById(Comment.class, id);
      mgr.deletePersistent(comment);
    } finally {
      mgr.close();
    }
    return comment;
  }

  private static PersistenceManager getPersistenceManager() {
    return PMF.get().getPersistenceManager();
  }

}
